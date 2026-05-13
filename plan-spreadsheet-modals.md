# Plano: Modais de Planilha + Remoção de Integrações

## Escopo

### Criação
1. `src/components/shared/GoogleSheetConnectModal.tsx`
   - Props: `open: boolean`, `onClose: () => void`
   - Formulário com React Hook Form + `googleSheetConnectSchema`
   - Campos: `name` (texto) e `spreadsheetUrl` (texto)
   - Chama `useConnectGoogleSheetMutation` no submit
   - Overlay nativo com `createPortal` (sem shadcn Dialog — não existe no projeto)
   - Fecha no clique fora do modal e no botão Cancelar

2. `src/components/shared/ExcelUploadModal.tsx`
   - Props: `open: boolean`, `onClose: () => void`
   - Formulário com React Hook Form + `excelUploadSchema`
   - Campos: `name` (texto) e `file` (input file, accept=".xlsx")
   - Chama `useUploadExcelMutation` no submit; invalida query `integrations` via `onSuccess`
   - Mesmo padrão de overlay do modal anterior

### Modificações
3. `src/components/layout/Sidebar.tsx`
   - Remover `'integrations'` do tipo `AppId`
   - Remover item `{ id: 'integrations', label: 'Integrações', icon: Plug }` de `NAV_ITEMS`
   - Remover `Plug` do import de `lucide-react`

4. `src/App.tsx`
   - Remover import de `IntegrationsPage`
   - Remover linha `{activeApp === 'integrations' && <IntegrationsPage />}`

5. `src/store/useAppStore.ts`
   - Remover `'integrations'` do tipo union `activeApp`

### Deleção
6. `src/pages/IntegrationsPage.tsx` — arquivo deletado

## Arquivos que NÃO serão alterados
- Hooks: `useConnectGoogleSheetMutation`, `useUploadExcelMutation`, `useIntegrationsQuery`
- Mutations: `useConnectIntegrationMutation`, `useSyncIntegrationMutation`, `useDisconnectIntegrationMutation`
- `src/lib/api/integrations.ts`
- `src/schemas/spreadsheets.ts`
- `src/types/index.ts`
- `src/lib/utils.ts`
