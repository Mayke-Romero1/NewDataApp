import { Image } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { SlideElement } from '@/types'
import { KPI_METRICS, SESSIONS_DATA, CHANNEL_DATA, AD_SPEND_DATA } from '@/lib/mockData'

const CHART_COLORS = ['#4f63f7', '#22c55e', '#f59e0b', '#ef4444', '#748bff', '#8b93c8', '#06b6d4']

const METRIC_MAP: Record<string, typeof KPI_METRICS[number]> = {
  sessions: KPI_METRICS[0],
  conversions: KPI_METRICS[1],
  cost: KPI_METRICS[2],
  roas: KPI_METRICS[3],
}

const TOOLTIP_STYLE = {
  background: '#13162a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  fontSize: 11,
}

const AXIS_TICK = { fontSize: 10, fill: '#525878' }

interface SlideElementRendererProps {
  element: SlideElement
}

const resolveChartData = (element: SlideElement) => {
  const { dataBinding } = element
  const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0

  if (isSpreadsheet) {
    const raw = dataBinding!.customData!
    const cols = Object.keys(raw[0] ?? {})
    const xKey = dataBinding!.xKey ?? cols[0] ?? 'x'
    const yKey = dataBinding!.yKey ?? cols[1] ?? cols[0] ?? 'y'
    const data = raw.map((row) => ({ ...row, [yKey]: Number(row[yKey]) || 0 })) as Record<string, unknown>[]
    return { data, xKey, yKey, isSpreadsheet: true as const }
  }

  const demoData = SESSIONS_DATA as unknown as Record<string, unknown>[]
  return { data: demoData, xKey: 'date', yKey: 'sessions', isSpreadsheet: false as const }
}

export const SlideElementRenderer = ({ element }: SlideElementRendererProps) => {
  const { type, style, content, dataBinding } = element

  if (type === 'text') {
    const justifyContent =
      style.textAlign === 'center' ? 'center'
      : style.textAlign === 'right' ? 'flex-end'
      : 'flex-start'

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: style.backgroundColor,
          color: style.color ?? '#f0f2ff',
          fontSize: style.fontSize ?? 16,
          fontWeight: style.fontWeight ?? 'normal',
          fontStyle: style.fontStyle ?? 'normal',
          textAlign: style.textAlign ?? 'left',
          borderRadius: style.borderRadius,
          border: style.borderWidth
            ? `${style.borderWidth}px solid ${style.borderColor}`
            : undefined,
          padding: style.padding ?? 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent,
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          lineHeight: 1.3,
          fontFamily: style.fontWeight === 'bold' ? 'Sora, sans-serif' : 'DM Sans, sans-serif',
        }}
      >
        {content ?? ''}
      </div>
    )
  }

  if (type === 'shape') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: style.backgroundColor ?? 'rgba(79,99,247,0.1)',
          borderRadius: style.borderRadius ?? 12,
          border: style.borderWidth
            ? `${style.borderWidth}px solid ${style.borderColor}`
            : undefined,
        }}
      />
    )
  }

  if (type === 'kpi') {
    const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0

    let label = ''
    let value = '—'
    let change: number | undefined
    let changeDirection: 'up' | 'down' | undefined

    if (isSpreadsheet) {
      const row = dataBinding!.customData![0]
      const cols = Object.keys(row)
      const yKey = dataBinding!.yKey ?? cols[1] ?? cols[0]
      const xKey = dataBinding!.xKey ?? cols[0]
      label = String(row[xKey] ?? '')
      value = String(row[yKey] ?? '—')
    } else {
      const metric = METRIC_MAP[dataBinding?.metric ?? 'sessions'] ?? KPI_METRICS[0]
      label = metric.label
      value = metric.value
      change = metric.change
      changeDirection = metric.changeDirection
    }

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: style.backgroundColor ?? 'rgba(255,255,255,0.04)',
          borderRadius: style.borderRadius ?? 12,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <p style={{ fontSize: 12, color: '#8b93c8', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 32, fontWeight: 700, color: '#f0f2ff', margin: 0, fontFamily: 'Sora, sans-serif' }}>
          {value}
        </p>
        {change !== undefined && changeDirection && (
          <p style={{
            fontSize: 12,
            color: changeDirection === 'up' ? '#22c55e' : '#ef4444',
            margin: 0,
          }}>
            {change > 0 ? '+' : ''}{change}% vs anterior
          </p>
        )}
      </div>
    )
  }

  if (type === 'chart') {
    const chartType = dataBinding?.chartType ?? 'area'
    const gradId = `grad-${element.id}`
    const { data, xKey, yKey } = resolveChartData(element)

    if (chartType === 'pie' || chartType === 'donut') {
      const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0
      const pieData = isSpreadsheet
        ? data.map((row, i) => ({
            name: String(row[xKey] ?? `Item ${i + 1}`),
            value: Number(row[yKey]) || 0,
            color: CHART_COLORS[i % CHART_COLORS.length],
          }))
        : CHANNEL_DATA

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={chartType === 'donut' ? '38%' : 0}
                outerRadius="65%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0.05 ? `${name} ${Math.round(percent * 100)}%` : ''
                }
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (chartType === 'bar_horizontal') {
      const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0
      const hData = isSpreadsheet
        ? data
        : AD_SPEND_DATA.map((d) => ({ platform: d.platform, spend: d.spend }))
      const hXKey = isSpreadsheet ? xKey : 'platform'
      const hYKey = isSpreadsheet ? yKey : 'spend'

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hData} layout="vertical">
              <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey={hXKey} tick={AXIS_TICK} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey={hYKey} fill="#4f63f7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (chartType === 'scatter') {
      const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0
      const sData = isSpreadsheet
        ? data.map((row) => ({ x: Number(row[xKey]) || 0, y: Number(row[yKey]) || 0 }))
        : SESSIONS_DATA.map((d) => ({ x: d.sessions, y: d.conversions }))

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <XAxis dataKey="x" type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} name={xKey} />
              <YAxis dataKey="y" type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} name={yKey} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={sData} fill="#4f63f7" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (chartType === 'bar') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey={yKey} fill="#4f63f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (chartType === 'line') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey={yKey} stroke="#4f63f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f63f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f63f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey={yKey} stroke="#4f63f7" fill={`url(#${gradId})`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'image') {
    if (content) {
      return (
        <img
          src={content}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: style.borderRadius ?? 8,
            display: 'block',
          }}
          alt=""
        />
      )
    }

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: style.borderRadius ?? 8,
          border: '1px dashed rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Image size={24} color="rgba(255,255,255,0.25)" />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Nenhuma imagem</span>
      </div>
    )
  }

  return null
}
