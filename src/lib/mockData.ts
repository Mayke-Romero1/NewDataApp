import type {
  Client,
  Dashboard,
  Integration,
  Slide,
  SlideElement,
  SlidePresentation,
} from '@/types'

// ─── Chart Data ───────────────────────────────────────────────────────────────

export const SESSIONS_DATA = [
  { date: '01/Mai', sessions: 4200, conversions: 134 },
  { date: '02/Mai', sessions: 3800, conversions: 112 },
  { date: '03/Mai', sessions: 5100, conversions: 189 },
  { date: '04/Mai', sessions: 4700, conversions: 156 },
  { date: '05/Mai', sessions: 6200, conversions: 224 },
  { date: '06/Mai', sessions: 5800, conversions: 198 },
  { date: '07/Mai', sessions: 7100, conversions: 267 },
  { date: '08/Mai', sessions: 6500, conversions: 241 },
  { date: '09/Mai', sessions: 7800, conversions: 312 },
  { date: '10/Mai', sessions: 8200, conversions: 334 },
  { date: '11/Mai', sessions: 7600, conversions: 289 },
  { date: '12/Mai', sessions: 9100, conversions: 378 },
]

export const AD_SPEND_DATA = [
  { platform: 'Google Ads', spend: 12400, revenue: 38600, roas: 3.1 },
  { platform: 'Meta Ads', spend: 8900, revenue: 22500, roas: 2.5 },
  { platform: 'TikTok Ads', spend: 3200, revenue: 11200, roas: 3.5 },
  { platform: 'LinkedIn Ads', spend: 5600, revenue: 9800, roas: 1.75 },
]

export const CHANNEL_DATA = [
  { name: 'Orgânico', value: 38, color: '#4f63f7' },
  { name: 'Pago', value: 27, color: '#748bff' },
  { name: 'Social', value: 18, color: '#22c55e' },
  { name: 'Email', value: 11, color: '#f59e0b' },
  { name: 'Direto', value: 6, color: '#8b93c8' },
]

export const SEARCH_CONSOLE_DATA = [
  { query: 'software gestão marketing', clicks: 1240, impressions: 18400, ctr: 6.7, position: 2.1 },
  { query: 'dashboard analytics', clicks: 980, impressions: 14200, ctr: 6.9, position: 1.8 },
  { query: 'relatório de ads automatizado', clicks: 756, impressions: 10800, ctr: 7.0, position: 3.2 },
  { query: 'criar slides com dados', clicks: 534, impressions: 8900, ctr: 6.0, position: 4.1 },
  { query: 'integrar GA4 dashboard', clicks: 412, impressions: 7200, ctr: 5.7, position: 5.3 },
]

// ─── KPI Mock ─────────────────────────────────────────────────────────────────

export const KPI_METRICS = [
  { label: 'Sessões', value: '68.4K', change: 12.4, changeDirection: 'up' as const, icon: 'users', color: '#4f63f7' },
  { label: 'Conversões', value: '2.634', change: 8.1, changeDirection: 'up' as const, icon: 'target', color: '#22c55e' },
  { label: 'Custo Total Ads', value: 'R$ 30.1K', change: -3.2, changeDirection: 'down' as const, icon: 'credit-card', color: '#f59e0b' },
  { label: 'ROAS Médio', value: '2.87×', change: 5.6, changeDirection: 'up' as const, icon: 'trending-up', color: '#748bff' },
]

// ─── Clients ──────────────────────────────────────────────────────────────────

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Coca-Cola',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 'client-2',
    name: 'Nike',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: 'client-3',
    name: 'Magazine Luiza',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  },
]

// ─── Integrations ─────────────────────────────────────────────────────────────

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int-1',
    provider: 'google_analytics',
    name: 'Google Analytics 4',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
    accountId: 'UA-12345678',
    accountName: 'Criva Digital',
  },
  {
    id: 'int-2',
    provider: 'google_ads',
    name: 'Google Ads',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 45),
    accountId: 'ADS-9876543',
    accountName: 'Criva Digital',
  },
  {
    id: 'int-3',
    provider: 'meta_ads',
    name: 'Meta Ads',
    status: 'disconnected',
  },
  {
    id: 'int-4',
    provider: 'tiktok_ads',
    name: 'TikTok Ads',
    status: 'disconnected',
  },
  {
    id: 'int-5',
    provider: 'linkedin_ads',
    name: 'LinkedIn Ads',
    status: 'disconnected',
  },
  {
    id: 'int-6',
    provider: 'search_console',
    name: 'Search Console',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 60),
    accountId: 'SC-55555',
    accountName: 'criva.digital',
  },
]

// ─── Dashboards ───────────────────────────────────────────────────────────────

export const MOCK_DASHBOARDS: Dashboard[] = [
  {
    id: 'dash-1',
    clientId: 'client-1',
    name: 'Performance de Marketing',
    description: 'Visão consolidada de todas as campanhas',
    widgets: [],
    integrations: ['int-1', 'int-2', 'int-3'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    isPublic: false,
    tags: ['marketing', 'ads'],
  },
  {
    id: 'dash-2',
    clientId: 'client-2',
    name: 'SEO & Conteúdo',
    description: 'Tráfego orgânico e posicionamento',
    widgets: [],
    integrations: ['int-1', 'int-6'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isPublic: true,
    tags: ['seo', 'orgânico'],
  },
  {
    id: 'dash-3',
    clientId: 'client-3',
    name: 'Overview Executivo',
    description: 'KPIs principais para a diretoria',
    widgets: [],
    integrations: ['int-1', 'int-2', 'int-3', 'int-6'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isPublic: false,
    tags: ['executivo', 'kpi'],
  },
]

// ─── Slide Mock Elements ──────────────────────────────────────────────────────

const SLIDE_1_ELEMENTS: SlideElement[] = [
  {
    id: 'el-s1-badge',
    type: 'text',
    x: 510, y: 200, width: 260, height: 36,
    rotation: 0, opacity: 1, zIndex: 1, visibility: true, locked: false,
    content: 'Relatório Mensal',
    style: {
      backgroundColor: 'rgba(79,99,247,0.15)',
      color: '#748bff',
      fontSize: 11,
      textAlign: 'center',
      borderRadius: 20,
      borderColor: 'rgba(79,99,247,0.25)',
      borderWidth: 1,
    },
  },
  {
    id: 'el-s1-title',
    type: 'text',
    x: 160, y: 250, width: 960, height: 120,
    rotation: 0, opacity: 1, zIndex: 2, visibility: true, locked: false,
    content: 'Performance de\nMarketing — Maio 2025',
    style: { color: '#f0f2ff', fontSize: 40, fontWeight: 'bold', textAlign: 'center' },
  },
  {
    id: 'el-s1-subtitle',
    type: 'text',
    x: 290, y: 382, width: 700, height: 44,
    rotation: 0, opacity: 1, zIndex: 3, visibility: true, locked: false,
    content: 'Dados ao vivo integrados com GA4, Meta Ads e Google Ads',
    style: { color: '#8b93c8', fontSize: 14, textAlign: 'center' },
  },
  {
    id: 'el-s1-kpi1',
    type: 'kpi',
    x: 350, y: 450, width: 260, height: 110,
    rotation: 0, opacity: 1, zIndex: 4, visibility: true, locked: false,
    style: {},
    dataBinding: { metric: 'sessions' },
  },
  {
    id: 'el-s1-kpi2',
    type: 'kpi',
    x: 670, y: 450, width: 260, height: 110,
    rotation: 0, opacity: 1, zIndex: 5, visibility: true, locked: false,
    style: {},
    dataBinding: { metric: 'conversions' },
  },
]

const SLIDE_2_ELEMENTS: SlideElement[] = [
  {
    id: 'el-s2-title',
    type: 'text',
    x: 64, y: 40, width: 700, height: 48,
    rotation: 0, opacity: 1, zIndex: 1, visibility: true, locked: false,
    content: 'Sessões no período',
    style: { color: '#f0f2ff', fontSize: 22, fontWeight: 'bold' },
  },
  {
    id: 'el-s2-source',
    type: 'text',
    x: 64, y: 92, width: 700, height: 28,
    rotation: 0, opacity: 1, zIndex: 2, visibility: true, locked: false,
    content: 'Fonte: Google Analytics 4 — últimos 12 dias',
    style: { color: '#8b93c8', fontSize: 12 },
  },
  {
    id: 'el-s2-chart',
    type: 'chart',
    x: 64, y: 130, width: 1152, height: 544,
    rotation: 0, opacity: 1, zIndex: 3, visibility: true, locked: false,
    style: {},
    dataBinding: { source: 'demo', metric: 'sessions', chartType: 'area' },
  },
]

const SLIDE_3_ELEMENTS: SlideElement[] = [
  {
    id: 'el-s3-title',
    type: 'text',
    x: 64, y: 32, width: 500, height: 48,
    rotation: 0, opacity: 1, zIndex: 1, visibility: true, locked: false,
    content: 'KPIs do mês',
    style: { color: '#f0f2ff', fontSize: 22, fontWeight: 'bold' },
  },
  {
    id: 'el-s3-kpi1',
    type: 'kpi',
    x: 64, y: 96, width: 548, height: 264,
    rotation: 0, opacity: 1, zIndex: 2, visibility: true, locked: false,
    style: {},
    dataBinding: { metric: 'sessions' },
  },
  {
    id: 'el-s3-kpi2',
    type: 'kpi',
    x: 668, y: 96, width: 548, height: 264,
    rotation: 0, opacity: 1, zIndex: 3, visibility: true, locked: false,
    style: {},
    dataBinding: { metric: 'conversions' },
  },
  {
    id: 'el-s3-kpi3',
    type: 'kpi',
    x: 64, y: 376, width: 548, height: 264,
    rotation: 0, opacity: 1, zIndex: 4, visibility: true, locked: false,
    style: {},
    dataBinding: { metric: 'cost' },
  },
  {
    id: 'el-s3-kpi4',
    type: 'kpi',
    x: 668, y: 376, width: 548, height: 264,
    rotation: 0, opacity: 1, zIndex: 5, visibility: true, locked: false,
    style: {},
    dataBinding: { metric: 'roas' },
  },
]

const MOCK_SLIDES_PRES1: Slide[] = [
  { id: 'slide-1-1', index: 0, background: '#0d0f1a', elements: SLIDE_1_ELEMENTS },
  { id: 'slide-1-2', index: 1, background: '#0d0f1a', elements: SLIDE_2_ELEMENTS },
  { id: 'slide-1-3', index: 2, background: '#0d0f1a', elements: SLIDE_3_ELEMENTS },
]

const MOCK_SLIDES_PRES2: Slide[] = [
  { id: 'slide-2-1', index: 0, background: '#0d0f1a', elements: [] },
]

// ─── Presentations ────────────────────────────────────────────────────────────

export const MOCK_PRESENTATIONS: SlidePresentation[] = [
  {
    id: 'pres-1',
    clientId: 'client-1',
    name: 'Relatório Mensal — Maio 2025',
    description: 'Resultados de performance do mês',
    theme: {
      primary: '#4f63f7',
      secondary: '#748bff',
      background: '#0d0f1a',
      text: '#f0f2ff',
      accent: '#22c55e',
      fontDisplay: 'Sora',
      fontBody: 'DM Sans',
    },
    slides: MOCK_SLIDES_PRES1,
    integrations: ['int-1', 'int-2', 'int-3'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    tags: ['relatório', 'mensal'],
  },
  {
    id: 'pres-2',
    clientId: 'client-3',
    name: 'Pitch de Resultados Q2',
    description: 'Apresentação para stakeholders',
    theme: {
      primary: '#4f63f7',
      secondary: '#748bff',
      background: '#ffffff',
      text: '#0d0f1a',
      accent: '#4f63f7',
      fontDisplay: 'Sora',
      fontBody: 'DM Sans',
    },
    slides: MOCK_SLIDES_PRES2,
    integrations: ['int-1', 'int-2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    tags: ['pitch', 'q2'],
  },
]
