# Plano — Integrações de Planilhas (Google Sheets + Excel MVP)

**Data:** 2026-05-13  
**Status:** Aprovado — em execução

---

## Escopo definido

A conexão com planilhas não terá página própria no menu lateral. As integrações acontecerão **dentro dos contextos de Dashboard e Slides**, quando o usuário configurar a fonte de dados de um elemento. Esta entrega cria a **fundação reutilizável** (modais + hooks + API) para que o próximo escopo possa plugar esses componentes diretamente nos painéis de configuração de elemento.

---

## Fluxos de conexão

### Google Sheets
1. Usuário abre o modal "Conectar Google Sheets" (chamado do Dashboard ou Slides futuramente)
2. Preenche **Nome** (apelido da planilha) + **URL da planilha** do Google
3. Confirma → `POST /integrations/google-sheets/connect` → backend retorna OAuth URL
4. Frontend armazena `oauth_state` no `sessionStorage` e redireciona para OAuth do Google
5. Após callback, backend cria a `Integration`

### Microsoft Excel (MVP)
1. Usuário abre o modal "Importar Excel"
2. Preenche **Nome** + seleciona arquivo **`.xlsx`**
3. Confirma → `POST /integrations/excel/upload` (multipart)
4. Backend processa, cria a `Integration` → modal fecha, query invalidada

---

## Arquivos removidos

| Arquivo | Motivo |
|---|---|
| `src/pages/IntegrationsPage.tsx` | Substituída pela abordagem contextual |

---

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/types/index.ts` | Adiciona `'microsoft_excel'` à union `IntegrationProvider`; adiciona `sheetUrl?: string` em `Integration` |
| `src/lib/utils.ts` | Adiciona `microsoft_excel` em `PROVIDER_LABELS`, `PROVIDER_COLORS`, `PROVIDER_ICONS` |
| `src/lib/api/integrations.ts` | Adiciona `connectGoogleSheet(name, spreadsheetUrl)` e `uploadExcelFile(name, file)` |
| `src/store/useAppStore.ts` | Remove `'integrations'` da union do `activeApp` |
| `src/components/layout/Sidebar.tsx` | Remove `'integrations'` do `AppId` e `NAV_ITEMS` |
| `src/App.tsx` | Remove import e render condition da `IntegrationsPage` |

---

## Arquivos criados

| Arquivo | Responsabilidade |
|---|---|
| `src/schemas/spreadsheets.ts` | Schemas Zod para os dois formulários |
| `src/hooks/mutations/useConnectGoogleSheetMutation.ts` | Chama `connectGoogleSheet` → armazena state → redireciona OAuth |
| `src/hooks/mutations/useUploadExcelMutation.ts` | Chama `uploadExcelFile` → invalida query `integrations` |
| `src/components/shared/GoogleSheetConnectModal.tsx` | Modal com form (nome + URL) — reutilizável em Dashboard e Slides |
| `src/components/shared/ExcelUploadModal.tsx` | Modal com form (nome + arquivo .xlsx) — reutilizável |

---

## O que NÃO é feito nesta entrega

- Integração visual dentro do editor de Dashboard ou Slides (próximo escopo)
- Listagem de planilhas conectadas dentro dos editores
- Mapeamento de colunas da planilha para métricas

---

## Critérios de conclusão

- [ ] TypeScript sem erros
- [ ] Menu "Integrações" removido do sidebar
- [ ] Google Sheets: modal valida URL, redireciona para OAuth ao confirmar
- [ ] Excel: modal valida .xlsx, faz upload ao confirmar e fecha
- [ ] Componentes modais exportados como named exports, prontos para uso nos editores
