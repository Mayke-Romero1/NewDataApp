# Plano — Slides Editor com Painel Direito

**Data:** 2026-05-13  
**Escopo:** Refatoração completa da `SlidesPage` para um editor de apresentações funcional com canvas absoluto, seleção/drag de elementos e painel de edição contextual na lateral direita.

---

## Situação atual

- `SlidesPage.tsx` tem 3 colunas: lista de apresentações | canvas + miniaturas | painel de propriedades
- O canvas é estático (`MockSlideCanvas`) — sem seleção, sem drag, sem elementos reais
- O painel direito tem apenas tema, fonte de dados e período — não é contextual
- `SlideElement` no `types/index.ts` já existe mas não está sendo usada no estado real

---

## Objetivo

Transformar a página de slides em um editor visual funcional inspirado em Google Slides / Canva:

- Canvas com sistema de coordenadas lógicas (1280×720)
- Elementos absolutamente posicionados, selecionáveis e arrastáveis
- Handles de resize visíveis ao selecionar
- Painel direito contextual:
  - Sem seleção → propriedades do slide (fundo, tema)
  - Elemento selecionado → propriedades do elemento (posição, tamanho, rotação, estilo, data binding)
- Toolbar para inserir novos elementos
- Deletar elemento selecionado com tecla Delete

---

## Sistema de Coordenadas do Canvas

- **Lógico:** 1280 × 720 px (proporcional 16:9)
- **Display:** escala para caber na área disponível — `scale = areaWidth / 1280`
- Posições armazenadas em coordenadas lógicas (independente do zoom do browser)

---

## Arquivos a criar

### `src/components/slides/SlideCanvas.tsx`
Canvas principal. Responsável por:
- Renderizar elementos do slide atual em posição absoluta
- Calcular scale factor para caber na área
- Capturar clique em elemento → selecionar
- Clique em fundo → desselecionar
- Drag via `onPointerDown/Move/Up` → mover elemento (converte coordenadas display → lógicas)
- Mostrar selection border + resize handles no elemento selecionado

### `src/components/slides/SlideElementRenderer.tsx`
Renderiza um `SlideElement` com base no seu `type`:
- `text` → tag configurável (h1/h2/p) com estilo do elemento
- `shape` → div com border-radius, fill, stroke configuráveis
- `kpi` → card com label, valor e variação
- `chart` → Recharts `AreaChart` / `BarChart` com dados do mockData
- `image` → img ou placeholder

### `src/components/slides/SlideEditorPanel.tsx`
Container do painel direito. Renderiza condicionalmente:
- `SlidePropertiesPanel` quando `selectedElementId === null`
- `ElementPropertiesPanel` quando um elemento está selecionado

### `src/components/slides/SlidePropertiesPanel.tsx`
Painel de propriedades do slide (sem seleção):
- Seletor de tema (grade de cores, 4 temas)
- Cor de fundo personalizada (input color)
- Contador de slides

### `src/components/slides/ElementPropertiesPanel.tsx`
Painel de propriedades do elemento selecionado:
- Seção **Layout**: inputs X, Y, W, H (em coordenadas lógicas)
- Seção **Transform**: Rotação (graus), Opacidade (0-100%)
- Seção **Camadas**: botões Trazer à frente, Enviar para trás, Lock, Hide
- Seção **Estilo** — condicional por tipo:
  - `text`: font-size, cor, negrito/itálico, alinhamento
  - `shape`: cor de preenchimento, cor do contorno, border-radius
  - `kpi`: label, valor, variação (mock)
  - `chart`: tipo (area/bar/line), fonte de dados, métrica, período
- Botão **Excluir elemento** (vermelho, na parte inferior)

### `src/components/slides/SlideThumbnailStrip.tsx`
Coluna de miniaturas à esquerda do canvas:
- Miniatura de cada slide (scale-down do canvas)
- Botão "+" para adicionar slide
- Indicador de slide ativo

---

## Arquivos a modificar

### `src/types/index.ts`
Atualizar `SlideElement`:
```typescript
interface SlideElement {
  id: string
  type: SlideElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number        // graus
  opacity: number         // 0–1
  zIndex: number
  visibility: boolean
  locked: boolean
  content?: string
  style: SlideElementStyle
  dataBinding?: SlideDataBinding
}

interface SlideElementStyle {
  backgroundColor?: string
  color?: string
  fontSize?: number
  fontWeight?: string
  textAlign?: 'left' | 'center' | 'right'
  borderRadius?: number
  borderColor?: string
  borderWidth?: number
  italic?: boolean
}

interface SlideDataBinding {
  source?: string
  metric?: string
  dateRange?: string
  chartType?: 'area' | 'bar' | 'line'
}
```

Atualizar `Slide`:
```typescript
interface Slide {
  id: string
  index: number
  background: string      // cor hex ou 'theme'
  elements: SlideElement[]
  notes?: string
  thumbnail?: string
}
```

### `src/store/useAppStore.ts`
Adicionar actions para manipulação de elementos:
- `addElement(presentationId, slideId, element)` 
- `updateElement(presentationId, slideId, elementId, patch)`
- `removeElement(presentationId, slideId, elementId)`
- `reorderElement(presentationId, slideId, elementId, direction)` — z-index

Atualizar `MOCK_PRESENTATIONS` para que os slides tenham `elements[]` reais (espelhando o que `MockSlideCanvas` renderizava).

### `src/pages/SlidesPage.tsx`
Refatorar para:
- `selectedElementId: string | null` como estado local
- Usar `SlideCanvas`, `SlideThumbnailStrip`, `SlideEditorPanel`
- Manter a toolbar superior (inserir texto, imagem, gráfico, shape)
- Handler de teclado `onKeyDown Delete` para remover elemento selecionado
- Remover `MockSlideCanvas` e toda lógica de mock inline

---

## Dados mock iniciais dos slides

Serão criados `SlideElement[]` para os 3 slides existentes, representando os mesmos elementos visuais que `MockSlideCanvas` renderizava:

**Slide 1 (Título):**
- `text` badge: "Relatório Mensal" — center, topo
- `text` título: "Performance de Marketing — Maio 2025" — center
- `text` subtítulo
- 2 × `kpi` — sessões e conversões

**Slide 2 (Gráfico):**
- `text` título: "Sessões no período"
- `text` subtítulo: fonte
- `chart` area chart com dados GA4

**Slide 3 (KPIs):**
- `text` título: "KPIs do mês"
- 4 × `kpi` em grid 2×2

---

## O que NÃO entra neste escopo

- Snap / alignment guides (fase futura)
- Animações de slide (fase futura)
- Exportação / apresentação em tela cheia (manter botões existentes sem funcionalidade nova)
- Integração real com API (mantém mock)
- Funcionalidade dos botões Compartilhar / Exportar (sem alteração)

---

## Critérios de aceitação

- [ ] Canvas renderiza elementos com posicionamento absoluto correto
- [ ] Clicar em elemento o seleciona (border visível)
- [ ] Clicar no fundo deseleciona
- [ ] Arrastar move o elemento e atualiza store
- [ ] Painel direito muda contexto conforme seleção
- [ ] Inputs de posição/tamanho refletem e atualizam o elemento
- [ ] Adicionar elemento via toolbar insere no centro do canvas
- [ ] Deletar elemento via tecla Delete funciona
- [ ] Miniaturas mostram o conteúdo real dos slides
- [ ] Zero erros TypeScript
- [ ] Nenhuma funcionalidade existente quebrada
