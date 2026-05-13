# Plano: Excluir Clientes na ClientsPage

## Escopo
Adicionar opção de exclusão nos cards de clientes em `src/pages/ClientsPage.tsx`.

## O que existe
- `deleteClient(id)` já implementado em `useAppStore.ts:54-58`
- Nenhum componente shared ou Dialog disponível no projeto
- CSS vars `--danger: #ef4444` disponível globalmente

## Alterações

### `src/pages/ClientsPage.tsx` (único arquivo modificado)

1. Adicionar `Trash2` ao import do `lucide-react`
2. Adicionar estado `deletingClientId: string | null` com `useState`
3. Adicionar `deleteClient` ao destructuring do `useAppStore`
4. Converter o `<button>` do card para `<div role="button">` com cursor-pointer, pois `<button>` dentro de `<button>` é HTML inválido
5. Adicionar ícone `Trash2` no canto superior direito do card:
   - Visível apenas no hover do card via `group-hover`
   - `onClick`: `e.stopPropagation()` + `setDeletingClientId(client.id)`
6. Quando `deletingClientId === client.id`, substituir o footer do card por uma confirmação inline:
   - Texto: "Excluir este cliente?"
   - Botão "Excluir" (vermelho) → `deleteClient(id)` + `setDeletingClientId(null)`
   - Botão "Cancelar" → `setDeletingClientId(null)`

## O que NÃO será feito
- Nenhum novo arquivo
- Nenhuma alteração no store (já tem `deleteClient`)
- Nenhum componente shared criado (caso isolado)
