# Plano — Área de Projetos Arquivados por Cliente

## Objetivo
Adicionar uma seção "Projetos Arquivados" na `ClientDetailPage`, permitindo visualizar dashboards e apresentações arquivados e restaurá-los ao fluxo ativo.

## Escopo

### 1. `src/store/useAppStore.ts`
- Adicionar action `unarchiveDashboard(id: string)` — seta `archived: false` no dashboard
- Adicionar action `unarchivePresentation(id: string)` — seta `archived: false` na apresentação

### 2. `src/pages/ClientDetailPage.tsx`

**Novos dados derivados:**
- `archivedDashboards` — `dashboards.filter(d => d.clientId === client.id && d.archived === true)`
- `archivedPresentations` — `presentations.filter(p => p.clientId === client.id && p.archived === true)`

**Novo componente `ArchivedItemMenu`:**
- Ações: "Restaurar" (RotateCcw icon) e "Excluir" (Trash2 icon, com confirmação)
- Sem "Copiar" e sem "Arquivar" (item já está arquivado)

**Cards arquivados:**
- Reutilizar `DashboardCard` e `PresentationCard` com prop `archived?: boolean`
- Quando `archived=true`: opacidade reduzida (`opacity-60`), badge "Arquivado" visível, menu substituído por `ArchivedItemMenu`

**Nova seção "Projetos Arquivados":**
- Posição: abaixo das seções ativas, separada por linha divisória
- Título: "Projetos Arquivados" com ícone `Archive`
- Colapsável via `useState` (expandido por padrão se houver itens)
- Exibe sub-grupos: Dashboards e Apresentações (apenas se houver itens em cada sub-grupo)
- Só renderiza a seção se `archivedDashboards.length + archivedPresentations.length > 0`

**Handlers novos:**
- `handleDashboardAction` — adicionar case `'restore'` chamando `unarchiveDashboard`
- `handlePresentationAction` — adicionar case `'restore'` chamando `unarchivePresentation`

## Arquivos modificados
| Arquivo | Tipo de alteração |
|---|---|
| `src/store/useAppStore.ts` | Adição de 2 actions |
| `src/pages/ClientDetailPage.tsx` | Adição de componentes e seção |

## Arquivos criados
Nenhum.

## O que NÃO será feito
- Não alterar a seção de projetos ativos
- Não modificar componentes em `shared/` ou `ui/`
- Não adicionar filtros, busca ou ordenação nos arquivados
