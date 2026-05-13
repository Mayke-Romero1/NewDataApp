# Plano: Filtro por data em dados de planilha

## Comportamento esperado
Quando a fonte for CSV ou Google Sheets, o usuário pode:
1. Indicar qual coluna da planilha contém as datas
2. Definir um intervalo "De / Até" usando um date picker
O sistema filtra o `customData` antes de passar para o gráfico/KPI.

Exemplo: planilha tem `date, spend` → seleciona coluna `date`, define 01/05 a 31/05 → o gráfico renderiza só as linhas dentro desse intervalo.

## Tipos de data suportados no parser
- ISO: `2025-05-01`
- Brasileiro: `01/05/2025`
- Americano: `05/01/2025`
- Parcial (só mês): `01/Mai` — incluído se possível, senão é ignorado (linha mantida no resultado)

## Arquivos modificados

### `src/types/index.ts`
Adicionar a `SlideDataBinding`:
- `dateColumn?: string` — nome da coluna que contém as datas
- `dateFrom?: string` — data inicial no formato `YYYY-MM-DD`
- `dateTo?: string` — data final no formato `YYYY-MM-DD`

### `src/components/slides/SlideElementRenderer.tsx`
- Adicionar `parseFlexDate(value: string): Date | null` — tenta ISO, DD/MM/YYYY, MM/DD/YYYY, fallback nativo
- Em `resolveChartData`: após montar `raw`, aplicar filtro se `dateColumn` estiver definido e (`dateFrom` ou `dateTo`) estiver preenchido
- Para KPI: mesma lógica no bloco de `kpi` (filtrar `customData` antes de pegar a primeira linha)

### `src/components/slides/ElementPropertiesPanel.tsx`
- Nova seção **"Filtro por data"** que aparece quando `source` é `spreadsheet` ou `google_sheets` E `columns.length > 0`
- Controles:
  - Select **"Coluna de data"** — populado com todas as colunas detectadas
  - Input `type="date"` **"De"**
  - Input `type="date"` **"Até"**
  - Botão limpar (×) para resetar `dateColumn`, `dateFrom`, `dateTo`
- Seção se repete para `chart` e `kpi` (mesma lógica)

## Arquivos criados
Nenhum.

## Arquivos removidos
Nenhum.
