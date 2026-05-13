# DataSlide — Plataforma de Slides & Dashboards

Plataforma de criação de dashboards analíticos e apresentações com dados ao vivo, integrada com GA4, Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads, Search Console e Google Sheets.

## Funcionalidades implementadas

- **Dashboard Builder** — gráficos de área, barras, pizza, cards de KPI e tabelas com dados mock
- **Editor de Slides** — canvas WYSIWYG com thumbnails, temas e propriedades
- **Integrações** — gerenciamento de conexões com status, sincronização e reconexão
- **Configurações** — perfil, workspace e planos

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS com design system dark/light
- Recharts para visualizações
- Zustand para estado global
- @dnd-kit para drag & drop

## Setup no Lovable

1. Faça upload deste projeto no Lovable
2. O Lovable instalará automaticamente as dependências
3. Use o prompt abaixo para expandir cada módulo

## Próximos passos sugeridos para o Lovable

### Dashboards
- Adicionar drag & drop real de widgets com @dnd-kit
- Implementar widget picker com galeria de tipos de gráfico
- Conectar filtros globais a todos os widgets
- Criar modal de configuração de widget com seletor de fonte de dados

### Slides
- Implementar canvas drag & drop com Fabric.js ou Konva.js
- Adicionar resize handles nos elementos
- Implementar sistema de histórico (undo/redo)
- Adicionar colaboração em tempo real (WebSocket)

### Integrações
- Implementar OAuth2 flow real para cada provedor
- Criar pipeline de ETL/sincronização com cache Redis
- Implementar scheduler de sincronização configurável

### Infra (backend separado)
- API REST/GraphQL com Node.js ou FastAPI
- PostgreSQL para metadados
- Redis para cache de dados das integrações
- Queue (Bull/BullMQ) para jobs assíncronos

## Estrutura de arquivos

```
src/
├── components/
│   ├── layout/         # Sidebar, Header
│   ├── dashboard/      # Widget, WidgetPicker (a criar)
│   ├── slides/         # Canvas, SlideElement (a criar)
│   └── ui/             # Componentes genéricos
├── pages/              # DashboardPage, SlidesPage, IntegrationsPage, SettingsPage
├── store/              # Zustand store global
├── lib/                # mockData, utils
└── types/              # TypeScript interfaces completas
```
