# Plano: Reestruturação do Layout SlidesPage (estilo Looker Studio)

## Arquivos a modificar

| Arquivo | Tipo de alteração |
|---|---|
| `src/store/useAppStore.ts` | Adicionar novos campos de estado |
| `src/App.tsx` | Condicionar render full-screen para slides |
| `src/pages/SlidesPage.tsx` | Reestruturação completa do layout |

---

## 1. `src/store/useAppStore.ts`

Adicionar à interface `AppState`:

```ts
slidesZoom: number
setSlidesZoom: (v: number) => void
slidesUpdatesActive: boolean
toggleSlidesUpdates: () => void
```

Adicionar na inicialização:

```ts
slidesZoom: 1,
setSlidesZoom: (v) => set({ slidesZoom: v }),
slidesUpdatesActive: true,
toggleSlidesUpdates: () => set((state) => ({ slidesUpdatesActive: !state.slidesUpdatesActive })),
```

---

## 2. `src/App.tsx`

Alterar o `AppContent` para que quando `activeApp === 'slides'`, o `<SlidesPage />` seja renderizado fora da estrutura `<Sidebar>` / `<Header>`, ocupando a tela toda:

```tsx
return (
  <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
    {activeApp === 'slides' ? (
      <SlidesPage />
    ) : (
      <>
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 flex overflow-hidden animate-fade-in">
            {activeApp === 'clients' && activeClientId === null && <ClientsPage />}
            {activeApp === 'clients' && activeClientId !== null && <ClientDetailPage />}
            {activeApp === 'dashboard' && <DashboardPage />}
            {activeApp === 'integrations' && <IntegrationsPage />}
            {activeApp === 'settings' && <SettingsPage />}
          </main>
        </div>
      </>
    )}
  </div>
)
```

---

## 3. `src/pages/SlidesPage.tsx`

### Estado local a adicionar

```ts
const [isEditingTitle, setIsEditingTitle] = useState(false)
const [editingTitle, setEditingTitle] = useState('')
const [openMenu, setOpenMenu] = useState<string | null>(null)
const [openChartDropdown, setOpenChartDropdown] = useState(false)
const [openControlDropdown, setOpenControlDropdown] = useState(false)
const [openZoomDropdown, setOpenZoomDropdown] = useState(false)
```

### Estado do store a adicionar ao destructuring

```ts
slidesZoom, setSlidesZoom, slidesUpdatesActive, toggleSlidesUpdates, setActiveApp
```

### Estrutura do novo layout

```
<div className="flex flex-col h-screen w-screen overflow-hidden outline-none">

  {/* === HEADER ROW 1 — barra de título estilo Google Slides === */}
  <div className="h-11 flex items-center px-3 gap-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex-shrink-0">

    {/* Esquerda */}
    <button onClick={() => setActiveApp('dashboard')}>
      <DataSlideIcon /> {/* ícone DataSlide */}
    </button>

    {/* Nome editável */}
    {isEditingTitle
      ? <input value={editingTitle} onBlur/onKeyDown(Enter) → confirma />
      : <span onClick={() => iniciar edição}>{activePresentation.name}</span>
    }

    {/* Menu de texto */}
    {['Arquivo', 'Editar', 'Exibir', 'Inserir', 'Organizar', 'Ajuda'].map(menu => (
      <button onClick={() => toggle openMenu}>
        {menu}
        <dropdown conteúdo relevante />
      </button>
    ))}

    <div className="flex-1" />

    {/* Direita */}
    <button>Redefinir</button>
    <button className="btn-secondary">Compartilhar</button>
    <button className="btn-primary" onClick={() => setIsPresentMode(true)}>Apresentar</button>
    <button title="Mais opções"><MoreHorizontal /></button>
  </div>

  {/* === HEADER ROW 2 — toolbar de edição === */}
  <div className="h-10 flex items-center px-3 gap-1 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex-shrink-0">

    {/* Esquerda */}
    <Undo2 /> <Redo2 />
    <Separator />
    <MousePointer2 /> {/* cursor seleção */}
    <ZoomDropdown options={[50, 75, 100, 125, 150]} />
    <Separator />
    <ChevronLeft disabled={index===0} /> {/* prev slide */}
    <span>Página {activeSlideIndex+1} de {total}</span>
    <ChevronRight disabled={index===last} /> {/* next slide */}

    {/* Centro */}
    <div className="flex-1 flex justify-center gap-1">
      <Database /> {/* add dados */}
      <Separator />
      <ChartDropdown tipos={['Área', 'Linha', 'Barras', 'Pizza', 'Donut', 'KPI']} />
      <ControlDropdown tipos={['Filtro de data', 'Filtro de texto', 'Seletor']} />
      <Separator />
      <Type /> {/* texto */}
      <ImageIcon /> {/* imagem */}
      <ShapeIcon /> {/* shape */}
      <Separator />
      <Grid3x3 toggle /> {/* grade */}
      <Magnet toggle /> {/* guias inteligentes */}
    </div>

    {/* Direita */}
    <Palette /> {/* tema e layout */}
    <ToggleUpdates /> {/* pausar atualizações */}
  </div>

  {/* === LAYOUT PRINCIPAL === */}
  <div className="flex flex-1 overflow-hidden">
    <SlideThumbnailStrip ... />
    <SlideCanvas ... />
    <SlideEditorPanel ... /> ou <SlideEditorPanel + SlideDataPanel />
  </div>

</div>
```

### Menus dropdown (Linha 1)

| Menu | Itens |
|---|---|
| Arquivo | Novo slide, Duplicar apresentação, Exportar, Redefinir |
| Editar | Desfazer, Refazer, Recortar, Copiar, Colar, Selecionar tudo |
| Exibir | Grade, Guias inteligentes, Modo apresentação |
| Inserir | Texto, Imagem, Gráfico, Shape, KPI |
| Organizar | Agrupar, Desagrupar, Trazer à frente, Enviar para trás |
| Ajuda | Atalhos de teclado |

### Zoom

Dropdown com opções: 50%, 75%, 100%, 125%, 150%. Valor padrão 100% (store: `slidesZoom = 1`). A seleção chama `setSlidesZoom(v / 100)`. O `<SlideCanvas>` já recebe `zoom` como prop (verificar se existe ou se precisa passar via estilo).

---

## Critérios de aceitação

- [x] `activeApp === 'slides'` → full screen, sem Sidebar nem Header global
- [x] Header Row 1 com nome editável inline, menus dropdown e botões direitos
- [x] Header Row 2 com toolbar completa (undo/redo, zoom, navegação, inserção, toggles)
- [x] Layout principal mantém SlideThumbnailStrip + SlideCanvas + SlideEditorPanel
- [x] Nenhuma funcionalidade existente quebrada
- [x] Zero erros TypeScript
- [x] `slidesZoom`, `setSlidesZoom`, `slidesUpdatesActive`, `toggleSlidesUpdates` no store
