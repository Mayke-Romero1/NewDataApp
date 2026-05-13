# Plano: Integração de Planilhas + Mais Gráficos + Upload de Imagem

## Escopo

### 1. Integração de dados de planilhas (Chart + KPI)

**`src/types/index.ts`**
- Expandir `SlideDataBinding`:
  - `source?: 'demo' | 'spreadsheet'`
  - `customData?: Record<string, unknown>[]` — linhas parseadas do CSV
  - `xKey?: string` — coluna do eixo X / rótulos
  - `yKey?: string` — coluna do eixo Y / valores
  - `chartType` expandido com novos tipos (ver item 2)

**`src/components/slides/ElementPropertiesPanel.tsx`** — seção Chart
- Seletor "Fonte de dados": botões **Demo** | **Planilha**
- Quando Planilha: input `type="file" accept=".csv"` para upload
- Após upload: selects **Coluna X** e **Coluna Y** populados com as colunas detectadas
- Período só aparece no modo Demo
- `parseCSV` como função local inline (sem arquivo separado)

**`src/components/slides/ElementPropertiesPanel.tsx`** — seção KPI
- Seletor "Fonte de dados": botões **Demo** | **Planilha**
- Quando Planilha: input CSV + select **Coluna do valor** + select **Coluna do rótulo**
- Demo preserva comportamento atual

---

### 2. Mais tipos de gráfico

Novos tipos adicionados ao `chartType`:

| Valor | Label |
|---|---|
| `bar_horizontal` | Barras Horizontais |
| `pie` | Pizza |
| `donut` | Rosca (Donut) |
| `scatter` | Dispersão |

**`src/types/index.ts`** — `chartType` expandido

**`src/components/slides/SlideElementRenderer.tsx`**
- Importar `PieChart, Pie, Cell, ScatterChart, Scatter, YAxis` do Recharts
- Implementar renderização de cada novo tipo:
  - `pie` / `donut`: PieChart + Cell — demo usa `CHANNEL_DATA`, planilha usa xKey/yKey
  - `bar_horizontal`: BarChart `layout="vertical"` + YAxis — demo usa `AD_SPEND_DATA`
  - `scatter`: ScatterChart — demo usa sessões vs conversões de `SESSIONS_DATA`
- Para `area`, `bar`, `line`: usar `customData` + `xKey`/`yKey` quando fonte for planilha

**`src/components/slides/ElementPropertiesPanel.tsx`**
- Select de tipo expandido com 4 novos valores

---

### 3. Upload de imagem

**`src/components/slides/SlideElementRenderer.tsx`**
- Quando `type === 'image'` e `content` é uma data URL: renderiza `<img src={content} />`
- Sem `content`: mantém placeholder atual com ícone

**`src/components/slides/ElementPropertiesPanel.tsx`** — seção Imagem (nova)
- Botão "Escolher imagem" (label sobre `<input type="file" accept="image/*" hidden>`)
- Lê com `FileReader.readAsDataURL`, chama `onUpdate({ content })`
- Preview thumbnail quando imagem já está carregada
- Botão "Remover" para limpar

---

## Arquivos modificados
| Arquivo | Alteração |
|---|---|
| `src/types/index.ts` | Expandir `SlideDataBinding` |
| `src/components/slides/SlideElementRenderer.tsx` | Novos gráficos + dados de planilha + imagem com conteúdo |
| `src/components/slides/ElementPropertiesPanel.tsx` | UI de planilha CSV + novos tipos de gráfico + upload de imagem |

## Arquivos criados
Nenhum.

## Arquivos removidos
Nenhum.
