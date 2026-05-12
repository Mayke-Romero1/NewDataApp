// ─── Integrations ─────────────────────────────────────────────────────────────

export type IntegrationProvider =
  | 'google_analytics'
  | 'google_ads'
  | 'meta_ads'
  | 'tiktok_ads'
  | 'linkedin_ads'
  | 'search_console'
  | 'google_sheets'

export interface Integration {
  id: string
  provider: IntegrationProvider
  name: string
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync?: Date
  accountId?: string
  accountName?: string
}

export interface MetricValue {
  label: string
  value: number
  change?: number // percentage change vs previous period
  changeDirection?: 'up' | 'down' | 'neutral'
}

export interface DataSource {
  integrationId: string
  provider: IntegrationProvider
  metric: string
  dimension?: string
  dateRange: 'last_7d' | 'last_30d' | 'last_90d' | 'custom'
  customDateRange?: { from: Date; to: Date }
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export type WidgetType =
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'kpi_card'
  | 'table'
  | 'area_chart'
  | 'funnel'
  | 'heatmap'

export interface WidgetLayout {
  x: number
  y: number
  w: number
  h: number
}

export interface Widget {
  id: string
  type: WidgetType
  title: string
  dataSource?: DataSource
  layout: WidgetLayout
  config: Record<string, unknown>
  mockData?: unknown[]
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  widgets: Widget[]
  integrations: string[] // integration ids used
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  tags: string[]
}

// ─── Slides ───────────────────────────────────────────────────────────────────

export type SlideElementType =
  | 'text'
  | 'image'
  | 'shape'
  | 'chart'
  | 'kpi'
  | 'table'

export interface SlideElement {
  id: string
  type: SlideElementType
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  content?: string
  dataSource?: DataSource
  style?: Record<string, string>
  config?: Record<string, unknown>
}

export interface Slide {
  id: string
  index: number
  background: string
  elements: SlideElement[]
  notes?: string
  thumbnail?: string
}

export interface SlidePresentation {
  id: string
  name: string
  description?: string
  theme: SlideTheme
  slides: Slide[]
  integrations: string[]
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface SlideTheme {
  primary: string
  secondary: string
  background: string
  text: string
  accent: string
  fontDisplay: string
  fontBody: string
}

// ─── Workspace ────────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer'

export interface WorkspaceMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  joinedAt: Date
}

export interface Workspace {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro' | 'business'
  members: WorkspaceMember[]
  integrations: Integration[]
  dashboards: Dashboard[]
  presentations: SlidePresentation[]
  createdAt: Date
}
