# Plano: Conexões Reais com Plataformas

## Objetivo
Substituir os handlers fake (setTimeout) da `IntegrationsPage` por fluxos OAuth 2.0 reais e chamadas de API tipadas, seguindo a arquitetura definida no CLAUDE.md.

## Premissa arquitetural
O projeto usa um backend REST em `VITE_API_URL` que:
- Fornece a URL de autorização OAuth de cada plataforma (`GET /integrations/auth-url/:provider`)
- Recebe o callback OAuth e troca o código pelo token (server-side)
- Expõe o estado atualizado das integrações (`GET /integrations`)
- Aciona sincronização (`POST /integrations/:id/sync`)
- Remove a conexão (`DELETE /integrations/:id`)

---

## Arquivos a CRIAR

### `dataslide/src/lib/fetch.ts`
Wrapper `apiFetch` obrigatório:
- Lê `VITE_API_URL` do ambiente
- Anexa `Authorization: Bearer <token>` quando disponível (token em `localStorage.getItem('access_token')`)
- Lança `ApiError` tipado com `status` e `message` em respostas não-ok

### `dataslide/src/lib/query-clients.ts`
Instância única do `QueryClient`:
- `staleTime: 30_000`
- `retry: 2`

### `dataslide/src/lib/api/integrations.ts`
Módulo de API com funções tipadas:
- `fetchIntegrations(): Promise<Integration[]>` → `GET /integrations`
- `getOAuthUrl(provider: IntegrationProvider): Promise<{ url: string; state: string }>` → `GET /integrations/auth-url/:provider`
- `syncIntegration(id: string): Promise<void>` → `POST /integrations/:id/sync`
- `disconnectIntegration(id: string): Promise<void>` → `DELETE /integrations/:id`

### `dataslide/src/hooks/queries/useIntegrationsQuery.ts`
`useQuery` que busca a lista de integrações:
- `queryKey: ['integrations']`
- `queryFn: fetchIntegrations`
- Retorna `{ integrations, isLoading, isError }`

### `dataslide/src/hooks/mutations/useConnectIntegrationMutation.ts`
`useMutation` que inicia o fluxo OAuth:
- Chama `getOAuthUrl(provider)`
- Redireciona com `window.location.href = url`
- Salva `state` em `sessionStorage` para validação CSRF no callback

### `dataslide/src/hooks/mutations/useSyncIntegrationMutation.ts`
`useMutation` que aciona sincronização:
- Chama `syncIntegration(id)`
- Em `onSuccess`: invalida `['integrations']` via `queryClient.invalidateQueries`

### `dataslide/src/hooks/mutations/useDisconnectIntegrationMutation.ts`
`useMutation` que remove a conexão:
- Chama `disconnectIntegration(id)`
- Em `onSuccess`: invalida `['integrations']`

### `dataslide/.env.example`
```
VITE_API_URL=http://localhost:3000
```

---

## Arquivos a MODIFICAR

### `dataslide/src/App.tsx`
- Importar `QueryClientProvider` e `queryClient` de `@/lib/query-clients`
- Envolver `<AppContent />` com `<QueryClientProvider client={queryClient}>`

### `dataslide/src/store/useAppStore.ts`
- Remover `integrations: MOCK_INTEGRATIONS` e `updateIntegrationStatus` — estado de integrações passa a ser gerenciado pelo cache do TanStack Query
- Manter todo o restante (dashboards, presentations, workspace, UI state)

### `dataslide/src/pages/IntegrationsPage.tsx`
- Substituir `useAppStore()` (integrations + updateIntegrationStatus) por `useIntegrationsQuery`
- Substituir `handleSync` (setTimeout) por `useSyncIntegrationMutation`
- Substituir `handleConnect` (setTimeout) por `useConnectIntegrationMutation`
- Adicionar botão "Desconectar" em integrações conectadas usando `useDisconnectIntegrationMutation`
- Exibir estados de loading/error vindos do TanStack Query

### `dataslide/src/lib/mockData.ts`
- Remover o export `MOCK_INTEGRATIONS` (não mais necessário)
- Manter todos os outros exports (SESSIONS_DATA, AD_SPEND_DATA, etc.)

### `dataslide/src/types/index.ts`
- Adicionar interface `ApiError` para erros tipados da API

---

## Arquivos a REMOVER / INALTERADOS

- **Inalterados**: DashboardPage, SlidesPage, SettingsPage, Sidebar, Header, types (exceto ApiError), utils, mockData (exceto MOCK_INTEGRATIONS)
- **Nada removido** — apenas a exportação MOCK_INTEGRATIONS é eliminada

---

## Dependência a instalar

```
@tanstack/react-query@^5
```

---

## O que NÃO está no escopo desta tarefa
- Dados reais nos gráficos do Dashboard (SESSIONS_DATA, AD_SPEND_DATA, KPI_METRICS)
- Autenticação de usuário / login flow
- Rota de callback OAuth (depende do backend)
- Integração com dados reais nas apresentações (Slides)
