# Plano: Integração Google Sheets via URL pública

## Como funciona
O usuário cola a URL da planilha (compartilhada como "Qualquer pessoa com o link pode ver").
O sistema extrai o `spreadsheetId` e o `gid` (aba), monta a URL de export CSV e faz `fetch()` no browser.
O CSV retornado é parseado e armazenado em `dataBinding.customData` — mesmo mecanismo já existente para CSV local.

## Formatos de URL suportados
| Formato | URL |
|---|---|
| Compartilhada (edição/visualização) | `https://docs.google.com/spreadsheets/d/{ID}/edit#gid={GID}` |
| Publicada na web | `https://docs.google.com/spreadsheets/d/e/{PUB_ID}/pub?output=csv` |

URL de fetch construída: `https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={GID}`

## Arquivos modificados

### `src/types/index.ts`
- Adicionar `'google_sheets'` ao union de `source`
- Adicionar `sheetsUrl?: string` ao `SlideDataBinding`

### `src/components/slides/ElementPropertiesPanel.tsx`
- Adicionar estado local: `sheetsUrlInput`, `fetchLoading`, `fetchError`
- Expandir `SourceToggle` para 3 opções: **Demo | CSV | Google Sheets**
- Nova seção quando `source === 'google_sheets'`:
  - Input de texto para colar a URL da planilha
  - Botão "Conectar" que dispara o fetch (com estado de loading)
  - Indicador de status: carregando / erro com mensagem / "N linhas carregadas"
  - Selects de Coluna X / Y aparecem após conexão bem-sucedida
- Função `extractSheetInfo(url)` inline para parsear URL e retornar `{ id, gid }`
- Handler `handleSheetsConnect` async: fetch → parseCSV → updateBinding

### `src/components/slides/SlideElementRenderer.tsx`
- `resolveChartData` e bloco KPI: incluir `'google_sheets'` na checagem de source além de `'spreadsheet'`
  (os dados já ficam em `customData`, a lógica de renderização é idêntica)

## Arquivos criados
Nenhum.

## Arquivos removidos
Nenhum.

## Tratamento de erros
- URL inválida → mensagem "URL inválida. Cole a URL da planilha do Google Sheets."
- Status HTTP != 2xx → "Planilha inacessível. Verifique se está compartilhada como pública."
- CORS bloqueado → "Erro de acesso. Publique a planilha via Arquivo → Compartilhar → Publicar na web."
- Planilha vazia → "Nenhum dado encontrado na planilha."
