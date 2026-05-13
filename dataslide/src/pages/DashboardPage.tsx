import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import {
  Plus, TrendingUp, TrendingDown, LayoutDashboard, Share2, Download
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { SESSIONS_DATA, AD_SPEND_DATA, CHANNEL_DATA, KPI_METRICS } from '@/lib/mockData'
import { cn, formatRelativeTime } from '@/lib/utils'


function MetricCard({ metric }: { metric: typeof KPI_METRICS[0] }) {
  const isUp = metric.changeDirection === 'up'
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">
          {metric.label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${metric.color}18` }}
        >
          <TrendingUp size={15} style={{ color: metric.color }} />
        </div>
      </div>
      <p className="font-display font-semibold text-2xl text-[var(--text-primary)] mt-1">
        {metric.value}
      </p>
      <div className="flex items-center gap-1 mt-0.5">
        {isUp ? (
          <TrendingUp size={13} className="text-green-400" />
        ) : (
          <TrendingDown size={13} className="text-red-400" />
        )}
        <span className={cn('text-xs font-medium', isUp ? 'text-green-400' : 'text-red-400')}>
          {metric.change > 0 ? '+' : ''}{metric.change}%
        </span>
        <span className="text-xs text-[var(--text-muted)]">vs mês anterior</span>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="card py-2 px-3 text-xs shadow-xl">
      <p className="text-[var(--text-secondary)] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value.toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const { dashboards, activeDashboardId, setActiveDashboard, createDashboard } = useAppStore()
  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId) ?? dashboards[0]

  return (
    <div className="flex h-full">
      {/* Dashboard list sidebar */}
      <aside className="w-52 border-r border-[var(--border)] flex flex-col py-4 px-3 gap-1 bg-[var(--bg-secondary)] flex-shrink-0">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Meus dashboards</span>
          <button
            onClick={() => createDashboard('Novo Dashboard')}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>
        {dashboards.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDashboard(d.id)}
            className={cn(
              'sidebar-item w-full text-left text-xs',
              activeDashboardId === d.id && 'active'
            )}
          >
            <LayoutDashboard size={14} className="flex-shrink-0" />
            <span className="truncate">{d.name}</span>
          </button>
        ))}
      </aside>

      {/* Main dashboard content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Dashboard header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-semibold text-lg text-[var(--text-primary)]">
              {activeDashboard?.name}
            </h2>
            {activeDashboard?.updatedAt && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Atualizado {formatRelativeTime(activeDashboard.updatedAt)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select className="input py-1.5 h-8 text-xs w-36">
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
              <option>Últimos 90 dias</option>
            </select>
            <button className="btn-secondary text-xs h-8 py-0">
              <Share2 size={13} /> Compartilhar
            </button>
            <button className="btn-primary text-xs h-8 py-0">
              <Download size={13} /> Exportar PDF
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {KPI_METRICS.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Sessions area chart */}
          <div className="card col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Sessões & Conversões
              </h3>
              <span className="badge badge-brand">GA4</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={SESSIONS_DATA}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f63f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f63f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#525878' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#525878' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sessions" stroke="#4f63f7" fill="url(#colorSessions)" strokeWidth={2} name="Sessões" />
                <Area type="monotone" dataKey="conversions" stroke="#22c55e" fill="url(#colorConversions)" strokeWidth={2} name="Conversões" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Channel pie */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Canais de tráfego
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={CHANNEL_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CHANNEL_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, '']} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {CHANNEL_DATA.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <span className="text-[var(--text-secondary)]">{c.name}</span>
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Ad spend bar chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Gasto vs Receita por Plataforma
              </h3>
              <span className="badge badge-warning">Ads</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={AD_SPEND_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#525878' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="platform" tick={{ fontSize: 11, fill: '#525878' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spend" fill="#4f63f7" name="Gasto" radius={[0, 4, 4, 0]} />
                <Bar dataKey="revenue" fill="#22c55e" name="Receita" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROAS table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                ROAS por Plataforma
              </h3>
              <span className="badge badge-success">Ao vivo</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 text-[var(--text-muted)] font-medium">Plataforma</th>
                  <th className="text-right py-2 text-[var(--text-muted)] font-medium">Gasto</th>
                  <th className="text-right py-2 text-[var(--text-muted)] font-medium">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {AD_SPEND_DATA.map((row) => (
                  <tr key={row.platform} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2.5 text-[var(--text-primary)] font-medium">{row.platform}</td>
                    <td className="py-2.5 text-right text-[var(--text-secondary)]">
                      R$ {(row.spend / 1000).toFixed(1)}K
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={cn(
                          'badge',
                          row.roas >= 3 ? 'badge-success' : row.roas >= 2 ? 'badge-brand' : 'badge-warning'
                        )}
                      >
                        {row.roas.toFixed(2)}×
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
