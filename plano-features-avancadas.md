# Plano: Features Avançadas do Editor de Slides

## Escopo

### 1. Atalhos de teclado — Copiar / Colar / Recortar / Selecionar tudo / Desfazer
- **Ctrl+C** → copia o(s) elemento(s) selecionado(s) para clipboard interno
- **Ctrl+X** → recorta (copia + remove) o(s) elemento(s) selecionado(s)
- **Ctrl+V** → cola com offset (+10px/+10px) para não sobrepor exato
- **Ctrl+A** → seleciona todos os elementos do slide ativo
- **Ctrl+Z** → desfaz a última ação (adicionar, mover, redimensionar, deletar, colar)

### 2. Multi-seleção com Shift+Click
- Shift+Click num elemento adiciona/remove da seleção atual
- `selectedElementId: string | null` → `selectedElementIds: string[]`
- Drag e resize aplicados simultaneamente a todos os selecionados
- Bounding box visual mostrando os limites do grupo
- Clicar em área vazia deseleciona tudo

### 3. Desfazer (Ctrl+Z) — History stack
- Stack de até 30 snapshots dos `elements[]` do slide ativo
- Snapshot salvo antes de: mover, redimensionar, adicionar, deletar, colar, recortar
- `undoHistory: SlideElement[][]` no estado de `SlidesPage`
- Não persiste no store — escopo de sessão apenas

### 4. Crop de imagem (double-click)
- Double-click em elemento `image` entra em modo crop
- Modo crop: cursor move e não o elemento inteiro, altera `objectPosition` CSS
- `cropMode: string | null` (elementId) no estado de `SlidesPage`
- Esc ou clique fora sai do crop
- Cursor `grab` / `grabbing` no modo crop

### 5. Coluna de thumbnails — Duplicar, Deletar, Reordenar, Menu de contexto

#### Duplicar / Deletar
- Botões de ação aparecem no hover do thumbnail
- Ícone de duplicar (`Copy`) e deletar (`Trash2`)
- Adicionar `duplicateSlide(index: number)` e `deleteSlide(index: number)` ao `useAppStore`

#### Drag-to-reorder
- Pointer events no thumbnail (`onPointerDown`) para arrastar verticalmente
- Indicador visual de drop position
- Ao soltar, chama `reorderSlide(from, to)` no store

#### Menu de contexto (botão direito)
- `onContextMenu` no thumbnail abre um dropdown (Radix `DropdownMenu`)
- Opções: **Copiar slide**, **Duplicar slide**, **Deletar slide**, **Ocultar na apresentação**
- Ocultar adiciona `hidden?: boolean` ao `Slide` — slide não aparece no `PresentationOverlay`

### 6. Formatação de métricas no KPI
- Novo campo `valueFormat?: 'number' | 'currency' | 'percent'` em `SlideDataBinding`
- Novo campo `decimalPlaces?: 0 | 1 | 2` em `SlideDataBinding`
- Novo campo `compact?: boolean` em `SlideDataBinding` (K/M)
- UI no `ElementPropertiesPanel` — seção KPI: 3 radio/toggle para formato + select casas decimais + toggle compacto
- `formatKpiValue` em `SlideElementRenderer` usa esses campos para formatar
- Para `currency`: prefixo `R$ ` + locale `pt-BR`
- Para `percent`: sufixo `%`

---

## Arquivos modificados

### `src/types/index.ts`
- `SlideDataBinding`: adicionar `valueFormat`, `decimalPlaces`, `compact`
- `Slide`: adicionar `hidden?: boolean`

### `src/store/useAppStore.ts`
- Adicionar `duplicateSlide(index: number)`
- Adicionar `deleteSlide(index: number)`
- Adicionar `reorderSlide(from: number, to: number)`
- Adicionar `toggleSlideHidden(index: number)`

### `src/pages/SlidesPage.tsx`
- `selectedElementId: string | null` → `selectedElementIds: string[]`
- Adicionar `clipboard: SlideElement[] | null`
- Adicionar `undoHistory: SlideElement[][]`
- Adicionar `cropElementId: string | null`
- `handleKeyDown`: Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+Z
- Passar `selectedElementIds`, callbacks de seleção atualizado para `SlideCanvas`
- Passar `cropElementId`, `onEnterCrop`, `onExitCrop` para `SlideCanvas`
- `PresentationOverlay`: pular slides com `hidden === true`

### `src/components/slides/SlideCanvas.tsx`
- Receber `selectedElementIds: string[]` em vez de `selectedElementId`
- `ElementOverlay`: highlight se `selectedElementIds.includes(element.id)`
- Shift+click: adicionar/remover da seleção
- Click sem shift: selecionar só esse elemento
- Drag: aplicar delta a todos os selecionados
- Bounding box visual para multi-seleção
- Crop mode: quando `cropElementId === element.id` pointer move `objectPosition`

### `src/components/slides/SlideThumbnailStrip.tsx`
- Adicionar botões de hover (Duplicate / Delete) por thumbnail
- Adicionar `onContextMenu` abrindo `DropdownMenu` por thumbnail
- Implementar drag-to-reorder com pointer events
- Props adicionais: `onDuplicateSlide`, `onDeleteSlide`, `onReorderSlide`, `onToggleSlideHidden`

### `src/components/slides/ElementPropertiesPanel.tsx`
- Seção KPI: adicionar controles de `valueFormat`, `decimalPlaces`, `compact`

### `src/components/slides/SlideElementRenderer.tsx`
- `formatKpiValue`: aceitar `valueFormat`, `decimalPlaces`, `compact` opcionais
- Aplicar formatação de moeda, porcentagem e casas decimais

## Arquivos criados
Nenhum.

## Arquivos removidos
Nenhum.

## Ordem de execução
1. `types/index.ts` — adicionar campos
2. `useAppStore.ts` — novos métodos de slide
3. `SlideElementRenderer.tsx` — formatação KPI
4. `ElementPropertiesPanel.tsx` — controles KPI
5. `SlidesPage.tsx` — multi-select state, atalhos, undo, crop
6. `SlideCanvas.tsx` — multi-select UI, drag multi, crop mode
7. `SlideThumbnailStrip.tsx` — hover actions, context menu, drag reorder
