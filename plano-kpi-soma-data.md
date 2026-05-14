# Plano: KPI com soma por período de data

## Comportamento novo

### KPI com fonte CSV / Google Sheets
- **Remove** "Coluna do rótulo" (xKey) — label não vem mais da planilha
- **Mantém** "Coluna de dados" (yKey) — escolhe qual coluna somar
- **Valor exibido** = SOMA de todos os valores da coluna selecionada nas linhas filtradas pelo período
- **Label** do card = nome da coluna (yKey) — exibido automaticamente como contexto
- **Formatação** do número: K para milhares, M para milhões, locale pt-BR

Exemplo: planilha com `date, spend` → coluna de dados = `spend` → De 01/05 Até 31/05 → card mostra `spend: R$ 15.200`

### Chart (sem alteração)
Mantém X/Y axis + DateFilter como está.

## Arquivos modificados

### `src/components/slides/ElementPropertiesPanel.tsx`
- Seção KPI (spreadsheet e google_sheets): remover bloco "Coluna do rótulo"
- Renomear label "Coluna do valor" → "Coluna de dados"

### `src/components/slides/SlideElementRenderer.tsx`
- Bloco KPI isSpreadsheet:
  - Filtrar linhas por data (já existe)
  - Somar `Number(row[yKey])` de todas as linhas filtradas
  - Formatar com `formatKpiValue` (K/M/locale pt-BR)
  - `label = yKey` (nome da coluna)
  - Remover `change` / `changeDirection` (não há dado de variação nesse modo)

## Arquivos criados / removidos
Nenhum.
