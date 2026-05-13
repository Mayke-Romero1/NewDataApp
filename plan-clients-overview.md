# Plano — Visão Geral de Clientes

**Data:** 2026-05-13  
**Autor:** Claude (Principal Frontend Architect)

---

## Objetivo

Criar a funcionalidade de gerenciamento de **Clientes**, onde o usuário pode:
1. Ver todos os clientes em uma tela de visão geral (lista/grid de cards)
2. Criar novos clientes
3. Acessar um cliente específico e, dentro dele, criar **Dashboards** ou **Apresentações (PPT)**

---

## Arquivos a Criar

### 1. `src/pages/ClientsPage.tsx`
Página de visão geral dos clientes com grid de cards. Cada card exibe:
- Avatar com iniciais do cliente (colorido por índice)
- Nome do cliente
- Contadores: nº de dashboards e nº de apresentações
- Data de criação
- Botão de acesso "Abrir"

Contém um botão "Novo Cliente" que abre um modal inline para inserir o nome.

### 2. `src/pages/ClientDetailPage.tsx`
Página interna de um cliente específico. Exibe:
- Breadcrumb "Clientes > [Nome do Cliente]" com botão de voltar
- Seção **Dashboards**: grid de cards dos dashboards deste cliente + botão "Novo Dashboard"
- Seção **Apresentações**: grid de cards das apresentações deste cliente + botão "Nova Apresentação"
- Estado vazio com call-to-action quando não há itens

---

## Arquivos a Modificar

### 3. `src/types/index.ts`
- Adicionar interface `Client`:
  ```typescript
  interface Client {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  ```
- Adicionar campo opcional `clientId?: string` em `Dashboard`
- Adicionar campo opcional `clientId?: string` em `SlidePresentation`

### 4. `src/lib/mockData.ts`
- Adicionar `MOCK_CLIENTS`: array com 3 clientes de exemplo (Coca-Cola, Nike, Magazine Luiza) sem dashboards/apresentações ainda vinculados (clientId nos dashboards mock permanece undefined — clientes começam vazios para não alterar dados existentes)

### 5. `src/store/useAppStore.ts`
- Adicionar ao estado: `clients: Client[]` (inicializado com `MOCK_CLIENTS`)
- Adicionar ao estado: `activeClientId: string | null`
- Adicionar ações:
  - `setActiveClient(id: string | null)`
  - `createClient(name: string)` — gera id com timestamp
  - `deleteClient(id: string)`
- Atualizar `createDashboard(name, clientId?: string)` — aceita clientId opcional
- Atualizar `createPresentation(name, clientId?: string)` — aceita clientId opcional
- Atualizar o tipo de `activeApp`: adicionar `'clients'`

### 6. `src/components/layout/Sidebar.tsx`
- Adicionar item "Clientes" com ícone `Users` da Lucide React na lista `NAV_ITEMS`
- Posicionar acima de "Dashboards" (primeiro item)

### 7. `src/App.tsx`
- Adicionar case `'clients'` no render condicional:
  - Se `activeClientId !== null` → renderiza `<ClientDetailPage />`
  - Se `activeClientId === null` → renderiza `<ClientsPage />`

---

## Comportamento de Navegação

```
Sidebar → "Clientes"
  → activeApp = 'clients', activeClientId = null
  → Renderiza ClientsPage

ClientsPage → Clica em um card
  → activeClientId = cliente.id
  → Renderiza ClientDetailPage

ClientDetailPage → Botão "Voltar"
  → activeClientId = null
  → Volta para ClientsPage

ClientDetailPage → "Novo Dashboard"
  → createDashboard(name, activeClientId)
  → Aparece na seção de dashboards do cliente

ClientDetailPage → "Nova Apresentação"
  → createPresentation(name, activeClientId)
  → Aparece na seção de apresentações do cliente
```

---

## O que NÃO será alterado

- Lógica de dashboards e apresentações existentes (sem clientId) — continuam funcionando normalmente nas páginas Dashboards e Slides
- Componentes em `components/ui/` e `components/shared/`
- Páginas `IntegrationsPage`, `SettingsPage`, `DashboardPage` e `SlidesPage`
- Hooks de integração

---

## Resumo de Arquivos

| Operação | Arquivo |
|----------|---------|
| Criar | `src/pages/ClientsPage.tsx` |
| Criar | `src/pages/ClientDetailPage.tsx` |
| Modificar | `src/types/index.ts` |
| Modificar | `src/lib/mockData.ts` |
| Modificar | `src/store/useAppStore.ts` |
| Modificar | `src/components/layout/Sidebar.tsx` |
| Modificar | `src/App.tsx` |

**Total: 2 novos arquivos, 5 modificações.**
