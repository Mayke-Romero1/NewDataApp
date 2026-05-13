# Plano: Colapso de Painéis + Modo Apresentar

## Escopo

### 1. Colapso dos painéis laterais

**`SlideThumbnailStrip.tsx`**
- Adicionar props `isCollapsed: boolean` e `onToggleCollapse: () => void`
- Estado recolhido: strip de `w-8` com apenas um botão `ChevronRight` centralizado
- Estado expandido: layout atual + botão `ChevronLeft` no topo para recolher

**`SlideEditorPanel.tsx`**
- Adicionar props `isCollapsed: boolean` e `onToggleCollapse: () => void`
- Estado recolhido: strip de `w-8` com apenas um botão `ChevronLeft` centralizado
- Estado expandido: layout atual + botão `ChevronRight` no topo para recolher

**`SlidesPage.tsx`**
- Adicionar estados: `isThumbnailCollapsed` (false), `isEditorCollapsed` (false)
- Passar `isCollapsed` e `onToggleCollapse` para ambos os componentes
- O `SlideCanvas` (`flex-1`) se expande automaticamente quando os painéis são recolhidos

### 2. Modo Apresentar (fullscreen)

**`SlidesPage.tsx`** — inline component `PresentationOverlay`
- Adicionar estados: `isPresentMode` (false), `presentSlideIndex` (inicia no slide ativo)
- Botão "Apresentar" chama `setIsPresentMode(true)` passando o índice atual
- Overlay fixo (`position: fixed`, `inset: 0`, `z-index: 9999`) com fundo preto
- Slide renderizado via `SlideElementRenderer` escalado para preencher a tela (aspect ratio 16:9 preservado)
- Navegação: botões `←` / `→` e teclas `ArrowLeft` / `ArrowRight`
- Contador de slide (ex: `2 / 3`)
- Fechar: botão `✕` no canto superior direito ou tecla `Escape`

## Arquivos modificados
| Arquivo | Tipo de alteração |
|---|---|
| `src/components/slides/SlideThumbnailStrip.tsx` | Adicionar props de colapso + render condicional |
| `src/components/slides/SlideEditorPanel.tsx` | Adicionar props de colapso + render condicional |
| `src/pages/SlidesPage.tsx` | Novos estados, handlers e overlay de apresentação |

## Arquivos criados
Nenhum.

## Arquivos removidos
Nenhum.
