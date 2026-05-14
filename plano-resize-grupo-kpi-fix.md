# Plano: Resize multi-seleção, Agrupar/Desagrupar e fix KPI planilha

## 1. Resize em multi-seleção

### Problema
Ao redimensionar um elemento enquanto vários estão selecionados, apenas o elemento arrastado muda de tamanho. O esperado é que todos os selecionados sejam redimensionados pelo mesmo delta.

### Solução
- Adicionar `onResizeDelta` callback em `ElementOverlay` (similar a `onDragDelta`)
- No `handleResizeMove` quando `isInMultiSelect`: computar delta (dx, dy, dw, dh) em relação ao tamanho original, chamar `onResizeDelta`
- Em `SlideCanvas`: adicionar `multiResizeStartRef` (captura posições/tamanhos de todos ao início do resize), `handleResizeDelta` aplica o mesmo delta a todos via `onUpdateMultiple`
- O elemento diretamente arrastado continua sendo atualizado via `onUpdate` (como já funciona)

## 2. Agrupar / Desagrupar

### Comportamento
- Ctrl+G com múltiplos elementos selecionados → agrupa (atribui mesmo `groupId`)
- Ctrl+G com elementos de um grupo selecionado → desagrupa (remove `groupId`)
- Botão direito no canvas → menu contextual com "Agrupar" / "Desagrupar"
- Clicar em elemento com `groupId` seleciona todos do grupo automaticamente
- Bounding box e drag já funcionam naturalmente com a seleção expandida

### Arquivos

#### `src/types/index.ts`
- Adicionar `groupId?: string` a `SlideElement`

#### `src/store/useAppStore.ts`
- Adicionar `groupElements(presentationId, slideId, elementIds)` — atribui UUID compartilhado como groupId
- Adicionar `ungroupElements(presentationId, slideId, groupId)` — remove groupId dos elementos do grupo

#### `src/pages/SlidesPage.tsx`
- `handleSelectElement`: quando elemento tem `groupId`, expandir seleção para todos do grupo
- Ctrl+G: agrupar se seleção não está toda no mesmo grupo; desagrupar se está
- Props novas para SlideCanvas: `onGroupElements`, `onUngroupElements`

#### `src/components/slides/SlideCanvas.tsx`
- Estado `canvasContextMenu: { x, y } | null` (posição do menu ao clicar direito no canvas)
- `onContextMenu` em `ElementOverlay` dispara o menu
- Menu mostra: Agrupar / Desagrupar / Copiar / Excluir
- Callbacks recebidos via props de SlidesPage

## 3. Fix: KPI com dados de planilha

### Problema provável
Valores numéricos na planilha podem ter formatação (separadores de milhar com vírgula, formato BR `1.234,56`, espaços, etc.) que fazem `Number()` retornar NaN → 0. Resultado: soma mostra 0 ou KPI não exibe o valor esperado.

### Solução
- Adicionar `parseNumber(v: unknown): number` em `SlideElementRenderer` com fallbacks:
  1. `Number(v)` — se funcionar, usar
  2. Remove vírgulas como separador de milhar: `"1,234"` → `1234`
  3. Tenta formato BR: `"1.234,56"` → `1234.56`
- Usar `parseNumber` na redução da soma KPI em vez de `Number(row[yKey]) || 0`
- Fix em `parseCSV` para detectar semicolons como delimitador alternativo (CSVs exportados com locale BR frequentemente usam `;`)

## Arquivos modificados
- `src/types/index.ts`
- `src/store/useAppStore.ts`
- `src/pages/SlidesPage.tsx`
- `src/components/slides/SlideCanvas.tsx`
- `src/components/slides/SlideElementRenderer.tsx`
- `src/components/slides/ElementPropertiesPanel.tsx` (parseCSV semicolons)

## Arquivos criados / removidos
Nenhum.
