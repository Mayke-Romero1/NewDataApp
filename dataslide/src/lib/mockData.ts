import type {
  Integration,
  Dashboard,
  SlidePresentation,
  Widget,
} from '@/types'

// ─── Integrations ─────────────────────────────────────────────────────────────

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int-1',
    provider: 'google_analytics',
    name: 'Google Analytics 4',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 15),
    accountName: 'Meu Site — GA4',
  },
  {
    id: 'int-2',
    provider: 'google_ads',
    name: 'Google Ads',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
    accountName: 'Conta Principal',
  },
  {
    id: 'int-3',
    provider: 'meta_ads',
    name: 'Meta Ads',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 45),
    accountName: 'Meta Business Suite',
  },
  {
    id: 'int-4',
    provider: 'tiktok_ads',
    name: 'TikTok Ads',
    status: 'disconnected',
    accountName: undefined,
  },
  {
    id: 'int-5',
    provider: 'linkedin_ads',
    name: 'LinkedIn Ads',
    status: 'error',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 3),
    accountName: 'LinkedIn Campaign Manager',
  },
  {
    id: 'int-6',
    provider: 'search_console',
    name: 'Search Console',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 60),
    accountName: 'meusite.com.br',
  },
  {
    id: 'int-7',
    provider: 'google_sheets',
    name: 'Google Sheets',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
    accountName: 'Planilhas conectadas',
  },
]

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

// ─── Dashboards ───────────────────────────────────────────────────────────────

export const MOCK_DASHBOARDS: Dashboard[] = [
  {
    id: 'dash-1',
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

// ─── Presentations ────────────────────────────────────────────────────────────

export const MOCK_PRESENTATIONS: SlidePresentation[] = [
  {
    id: 'pres-1',
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
    slides: [],
    integrations: ['int-1', 'int-2', 'int-3'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    tags: ['relatório', 'mensal'],
  },
  {
    id: 'pres-2',
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
    slides: [],
    integrations: ['int-1', 'int-2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    tags: ['pitch', 'q2'],
  },
]
