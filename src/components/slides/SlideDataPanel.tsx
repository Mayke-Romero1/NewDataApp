import { Plus, TrendingUp, TrendingDown, BarChart2, Search, ShoppingBag, Globe, Video, Briefcase, FileSpreadsheet, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { IntegrationProvider } from '@/types'
import { cn } from '@/lib/utils'

interface SlideDataPanelProps {
  integrationId: string
  onChangeIntegration: () => void
  onAddMetricElement: (metric: string) => void
}

interface MetricItem {
  key: string
  label: string
  value: string
  change: number
}

interface MetricCategory {
  label: string
  metrics: MetricItem[]
}

const GA4_CATEGORIES: MetricCategory[] = [
  {
    label: 'Audiência',
    metrics: [
      { key: 'sessions', label: 'Sessões', value: '68.4K', change: 12.4 },
      { key: 'users', label: 'Usuários', value: '54.1K', change: 8.7 },
      { key: 'new_users', label: 'Novos Usuários', value: '32.8K', change: 15.2 },
      { key: 'bounce_rate', label: 'Taxa de Rejeição', value: '42.3%', change: -3.1 },
    ],
  },
  {
    label: 'Engajamento',
    metrics: [
      { key: 'pages_per_session', label: 'Páginas por Sessão', value: '3.7', change: 5.2 },
      { key: 'avg_duration', label: 'Duração Média', value: '2m 34s', change: 7.8 },
      { key: 'events', label: 'Eventos', value: '124.5K', change: 18.3 },
    ],
  },
  {
    label: 'Conversão',
    metrics: [
      { key: 'conversions', label: 'Conversões', value: '2.634', change: 8.1 },
      { key: 'conversion_rate', label: 'Taxa de Conversão', value: '3.8%', change: 2.4 },
    ],
  },
]

const ADS_CATEGORIES: MetricCategory[] = [
  {
    label: 'Volume',
    metrics: [
      { key: 'impressions', label: 'Impressões', value: '1.2M', change: 9.4 },
      { key: 'clicks', label: 'Cliques', value: '48.3K', change: 6.1 },
      { key: 'ctr', label: 'CTR', value: '4.02%', change: -1.2 },
    ],
  },
  {
    label: 'Custo',
    metrics: [
      { key: 'spend', label: 'Gasto Total', value: 'R$ 30.1K', change: -3.2 },
      { key: 'cpc', label: 'CPC', value: 'R$ 0.62', change: -8.7 },
      { key: 'cpm', label: 'CPM', value: 'R$ 25.10', change: 2.1 },
      { key: 'cpa', label: 'CPA', value: 'R$ 11.42', change: -5.4 },
    ],
  },
  {
    label: 'Performance',
    metrics: [
      { key: 'conversions', label: 'Conversões', value: '2.634', change: 8.1 },
      { key: 'roas', label: 'ROAS', value: '2.87×', change: 5.6 },
      { key: 'revenue', label: 'Receita', value: 'R$ 86.5K', change: 11.3 },
    ],
  },
]

const SEARCH_CONSOLE_CATEGORIES: MetricCategory[] = [
  {
    label: 'Orgânico',
    metrics: [
      { key: 'clicks', label: 'Cliques', value: '3.9K', change: 14.2 },
      { key: 'impressions', label: 'Impressões', value: '59.5K', change: 8.6 },
      { key: 'avg_ctr', label: 'CTR Médio', value: '6.5%', change: 5.1 },
      { key: 'avg_position', label: 'Posição Média', value: '3.3', change: -2.8 },
    ],
  },
]

const PROVIDER_CATEGORIES: Partial<Record<IntegrationProvider, MetricCategory[]>> = {
  google_analytics: GA4_CATEGORIES,
  google_ads: ADS_CATEGORIES,
  meta_ads: ADS_CATEGORIES,
  tiktok_ads: ADS_CATEGORIES,
  linkedin_ads: ADS_CATEGORIES,
  search_console: SEARCH_CONSOLE_CATEGORIES,
}

const PROVIDER_ICON: Partial<Record<IntegrationProvider, React.ElementType>> = {
  google_analytics: BarChart2,
  google_ads: ShoppingBag,
  meta_ads: Globe,
  tiktok_ads: Video,
  linkedin_ads: Briefcase,
  search_console: Search,
  google_sheets: FileSpreadsheet,
  microsoft_excel: FileSpreadsheet,
}

export const SlideDataPanel = ({ integrationId, onChangeIntegration, onAddMetricElement }: SlideDataPanelProps) => {
  const { integrations } = useAppStore()
  const integration = integrations.find((i) => i.id === integrationId)

  if (!integration) return null

  const Icon = PROVIDER_ICON[integration.provider] ?? BarChart2
  const categories = PROVIDER_CATEGORIES[integration.provider] ?? []

  return (
    <aside className="w-[260px] border-l border-[var(--border)] flex flex-col bg-[var(--bg-secondary)] flex-shrink-0 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border)] flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[rgba(79,99,247,0.1)] flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-[#748bff]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{integration.name}</p>
          <p className="text-[10px] text-[var(--text-muted)]">Dados</p>
        </div>
        <button
          type="button"
          onClick={onChangeIntegration}
          title="Trocar integração"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((category) => (
          <div key={category.label}>
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              {category.label}
            </p>
            <div className="space-y-1">
              {category.metrics.map((metric) => (
                <MetricRow
                  key={metric.key}
                  metric={metric}
                  onAdd={() => onAddMetricElement(metric.key)}
                />
              ))}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-xs text-[var(--text-muted)] text-center py-6">
            Sem métricas disponíveis para esta integração.
          </p>
        )}
      </div>
    </aside>
  )
}

interface MetricRowProps {
  metric: MetricItem
  onAdd: () => void
}

const MetricRow = ({ metric, onAdd }: MetricRowProps) => {
  const isPositive = metric.change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-[var(--text-muted)] truncate">{metric.label}</p>
        <p className="text-xs font-semibold text-[var(--text-primary)] font-mono">{metric.value}</p>
      </div>

      <div className={cn('flex items-center gap-0.5 flex-shrink-0', isPositive ? 'text-emerald-400' : 'text-red-400')}>
        <TrendIcon size={10} />
        <span className="text-[10px] font-mono">
          {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
        </span>
      </div>

      <button
        type="button"
        onClick={onAdd}
        title={`Adicionar ${metric.label} ao slide`}
        className="w-5 h-5 flex items-center justify-center rounded border border-[var(--border)] text-[var(--text-muted)] hover:border-[#4f63f7] hover:text-[#748bff] hover:bg-[rgba(79,99,247,0.1)] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <Plus size={11} />
      </button>
    </div>
  )
}
