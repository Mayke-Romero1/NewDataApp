# Plano: Ações de Excluir, Arquivar e Duplicar

**Data:** 2026-05-13  
**Escopo:** Clientes (ClientsPage) + Dashboards e Apresentações (ClientDetailPage)

---

## O que será feito

### 1. `src/types/index.ts`
- Adicionar `archived?: boolean` às interfaces `Client`, `Dashboard` e `SlidePresentation`

### 2. `src/store/useAppStore.ts`
Adicionar as seguintes actions que ainda não existem:
- `archiveClient(id: string)` — define `archived: true` no cliente
- `archiveDashboard(id: string)` — define `archived: true` no dashboard
- `deletePresentation(id: string)` — remove a apresentação (ação ainda inexistente)
- `archivePresentation(id: string)` — define `archived: true` na apresentação
- `duplicateDashboard(id: string)` — cria cópia do dashboard com nome "Cópia de X"
- `duplicatePresentation(id: string)` — cria cópia da apresentação com nome "Cópia de X"

### 3. `src/pages/ClientsPage.tsx`
- Converter o `<button>` do card para `<div>` com área clicável interna (preserva navegação)
- Adicionar botão de três pontos (`MoreHorizontal`) no canto superior do card
- Menu dropdown inline com opções: **Arquivar** / **Excluir**
- Excluir exibe confirmação inline no card antes de executar
- Filtrar clientes com `archived: true` fora da lista principal

### 4. `src/pages/ClientDetailPage.tsx`
- Converter `<button>` dos cards de dashboard e apresentação para `<div>`
- Adicionar botão de três pontos por card com menu: **Copiar** / **Arquivar** / **Excluir**
- Excluir exibe confirmação inline
- Filtrar itens arquivados da listagem

---

## Padrão de UI do Menu

- Botão `...` sempre visível no canto superior direito do card
- Dropdown posicionado absolutamente (sem dependência de lib externa)
- Click fora fecha o menu (`useEffect` + `useRef`)
- Confirmação de exclusão exibida inline no próprio card (sem modal externo)

---

## O que NÃO será feito

- Nenhuma tela ou rota nova
- Nenhum componente shared novo
- Nenhuma mudança em arquivos de integração, settings ou sidebar
- Sem persistência real (continua usando Zustand em memória)
