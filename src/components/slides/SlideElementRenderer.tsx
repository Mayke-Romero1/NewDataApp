import { Image as ImageIcon, TrendingUp, Users, DollarSign, Target, BarChart2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { SlideElement, SlideElementStyle } from '@/types'
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

const FONT_WEIGHT_CSS: Record<string, number> = {
  normal: 400, medium: 500, semibold: 600, bold: 700,
}

const KPI_ICON_MAP = {
  trending_up: TrendingUp,
  users: Users,
  dollar: DollarSign,
  target: Target,
  bar_chart: BarChart2,
}

const resolveBackground = (style: SlideElementStyle, fallback?: string): string | undefined => {
  if (style.gradient?.enabled) {
    const [c1, c2] = style.gradient.colors
    if (style.gradient.type === 'radial') return `radial-gradient(circle, ${c1}, ${c2})`
    return `linear-gradient(${style.gradient.angle}deg, ${c1}, ${c2})`
  }
  return style.backgroundColor ?? fallback
}

interface SlideElementRendererProps {
  element: SlideElement
}

const parseFlexDate = (value: string): Date | null => {
  if (!value) return null
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}`)
    return isNaN(d.getTime()) ? null : d
  }
  const dmy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (dmy) {
    const d = new Date(`${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`)
    return isNaN(d.getTime()) ? null : d
  }
  const mdy = value.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (mdy) {
    const d = new Date(`${mdy[3]}-${mdy[1].padStart(2, '0')}-${mdy[2].padStart(2, '0')}`)
    return isNaN(d.getTime()) ? null : d
  }
  const native = new Date(value)
  return isNaN(native.getTime()) ? null : native
}

const applyDateFilter = (
  rows: Record<string, unknown>[],
  dateColumn: string | undefined,
  dateFrom: string | undefined,
  dateTo: string | undefined,
): Record<string, unknown>[] => {
  if (!dateColumn || (!dateFrom && !dateTo)) return rows
  const from = dateFrom ? new Date(dateFrom) : null
  const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null
  return rows.filter((row) => {
    const cellDate = parseFlexDate(String(row[dateColumn] ?? ''))
    if (!cellDate) return true
    if (from && cellDate < from) return false
    if (to && cellDate > to) return false
    return true
  })
}

const parseNumber = (v: unknown): number => {
  if (typeof v === 'number') return isNaN(v) ? 0 : v
  const s = String(v ?? '').trim()
  if (!s) return 0
  const direct = Number(s)
  if (!isNaN(direct)) return direct
  const noThousands = s.replace(/,/g, '')
  const noThousandsNum = Number(noThousands)
  if (!isNaN(noThousandsNum)) return noThousandsNum
  const brFormat = s.replace(/\./g, '').replace(',', '.')
  const brNum = Number(brFormat)
  if (!isNaN(brNum)) return brNum
  return 0
}

const formatKpiValue = (
  sum: number,
  valueFormat?: 'number' | 'currency' | 'percent',
  decimalPlaces?: 0 | 1 | 2,
  compact?: boolean,
): string => {
  const digits = decimalPlaces ?? 0
  const useCompact = compact !== false

  if (useCompact) {
    if (sum >= 1_000_000) {
      const n = (sum / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
      if (valueFormat === 'currency') return `R$ ${n}M`
      if (valueFormat === 'percent') return `${n}M%`
      return `${n}M`
    }
    if (sum >= 1_000) {
      const n = (sum / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
      if (valueFormat === 'currency') return `R$ ${n}K`
      if (valueFormat === 'percent') return `${n}K%`
      return `${n}K`
    }
  }

  const n = sum.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
  if (valueFormat === 'currency') return `R$ ${n}`
  if (valueFormat === 'percent') return `${n}%`
  return n
}

const resolveChartData = (element: SlideElement) => {
  const { dataBinding } = element
  const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0

  if (isSpreadsheet) {
    const raw = dataBinding!.customData!
    const filtered = applyDateFilter(raw, dataBinding!.dateColumn, dataBinding!.dateFrom, dataBinding!.dateTo)
    const cols = Object.keys(filtered[0] ?? raw[0] ?? {})
    const xKey = dataBinding!.xKey ?? cols[0] ?? 'x'
    const yKey = dataBinding!.yKey ?? cols[1] ?? cols[0] ?? 'y'
    const data = filtered.map((row) => ({ ...row, [yKey]: Number(row[yKey]) || 0 })) as Record<string, unknown>[]
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

    const textShadowCss = style.textShadow?.enabled
      ? `${style.textShadow.offsetX}px ${style.textShadow.offsetY}px ${style.textShadow.blur}px ${style.textShadow.color}`
      : undefined

    const background = resolveBackground(style)
    const fontFamily = style.fontFamily ?? 'DM Sans, sans-serif'
    const fontWeightCss = style.fontWeight ? (FONT_WEIGHT_CSS[style.fontWeight] ?? 400) : 400

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background,
          backgroundColor: background ? undefined : style.backgroundColor,
          color: style.color ?? '#f0f2ff',
          fontSize: style.fontSize ?? 16,
          fontWeight: fontWeightCss,
          fontStyle: style.fontStyle ?? 'normal',
          fontFamily,
          textAlign: style.textAlign ?? 'left',
          lineHeight: style.lineHeight ?? 1.3,
          letterSpacing: style.letterSpacing != null ? `${style.letterSpacing}px` : undefined,
          textShadow: textShadowCss,
          borderRadius: style.borderRadius,
          border: style.borderWidth
            ? `${style.borderWidth}px ${style.borderStyle ?? 'solid'} ${style.borderColor}`
            : undefined,
          padding: style.padding ?? 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent,
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
        }}
      >
        {content ?? ''}
      </div>
    )
  }

  if (type === 'shape') {
    const background = resolveBackground(style, 'rgba(79,99,247,0.1)')
    const boxShadowCss = style.boxShadow?.enabled
      ? `${style.boxShadow.offsetX}px ${style.boxShadow.offsetY}px ${style.boxShadow.blur}px ${style.boxShadow.spread}px ${style.boxShadow.color}`
      : undefined

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background,
          backgroundColor: background ? undefined : (style.backgroundColor ?? 'rgba(79,99,247,0.1)'),
          borderRadius: style.borderRadius ?? 12,
          border: style.borderWidth
            ? `${style.borderWidth}px ${style.borderStyle ?? 'solid'} ${style.borderColor}`
            : undefined,
          opacity: style.fillOpacity != null ? style.fillOpacity / 100 : undefined,
          boxShadow: boxShadowCss,
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
      const filtered = applyDateFilter(
        dataBinding!.customData!,
        dataBinding!.dateColumn,
        dataBinding!.dateFrom,
        dataBinding!.dateTo,
      )
      const cols = Object.keys(dataBinding!.customData![0] ?? {})
      const yKey = dataBinding!.yKey ?? cols[0]
      const sum = filtered.reduce((acc, row) => acc + parseNumber(row[yKey]), 0)
      label = yKey
      value = filtered.length > 0
        ? formatKpiValue(sum, dataBinding?.valueFormat, dataBinding?.decimalPlaces, dataBinding?.compact)
        : '—'
    } else {
      const metric = METRIC_MAP[dataBinding?.metric ?? 'sessions'] ?? KPI_METRICS[0]
      label = metric.label
      value = metric.value
      change = metric.change
      changeDirection = metric.changeDirection
    }

    const kpiValueColor = dataBinding?.kpiValueColor ?? '#f0f2ff'
    const changeColor = (() => {
      if (dataBinding?.kpiChangeColorMode === 'custom' && dataBinding.kpiChangeColor) {
        return dataBinding.kpiChangeColor
      }
      return changeDirection === 'up' ? '#22c55e' : '#ef4444'
    })()

    const KpiIconComponent = dataBinding?.kpiShowIcon && dataBinding?.kpiIcon
      ? KPI_ICON_MAP[dataBinding.kpiIcon]
      : null

    const kpiBg = resolveBackground(style, 'rgba(255,255,255,0.04)')
    const kpiBorder = style.borderWidth
      ? `${style.borderWidth}px ${style.borderStyle ?? 'solid'} ${style.borderColor}`
      : '1px solid rgba(255,255,255,0.08)'

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: kpiBg,
          backgroundColor: kpiBg ? undefined : 'rgba(255,255,255,0.04)',
          borderRadius: style.borderRadius ?? 12,
          border: kpiBorder,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {KpiIconComponent && <KpiIconComponent size={16} color="#8b93c8" />}
          <p style={{ fontSize: 12, color: '#8b93c8', margin: 0 }}>{label}</p>
        </div>
        <p style={{ fontSize: 32, fontWeight: 700, color: kpiValueColor, margin: 0, fontFamily: 'Sora, sans-serif' }}>
          {value}
        </p>
        {change !== undefined && changeDirection && (
          <p style={{ fontSize: 12, color: changeColor, margin: 0 }}>
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
    const primaryColor = dataBinding?.primaryColor ?? '#4f63f7'
    const secondaryColor = dataBinding?.secondaryColor ?? '#22c55e'
    const showAxes = dataBinding?.showAxes !== false
    const showGrid = dataBinding?.showGrid === true
    const showTooltipEl = dataBinding?.showTooltip !== false
    const showLegend = dataBinding?.showLegend === true
    const isClassic = dataBinding?.chartStyle === 'classic'
    const chartTitle = dataBinding?.chartTitle

    const chartWrapper = (children: React.ReactNode) => (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {chartTitle && (
          <p style={{ fontSize: 13, fontWeight: 600, color: '#c4c8e8', margin: '8px 8px 4px', fontFamily: 'Sora, sans-serif', flexShrink: 0 }}>
            {chartTitle}
          </p>
        )}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </div>
    )

    if (chartType === 'pie' || chartType === 'donut') {
      const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0
      const pieData = isSpreadsheet
        ? data.map((row, i) => ({
            name: String(row[xKey] ?? `Item ${i + 1}`),
            value: Number(row[yKey]) || 0,
            color: CHART_COLORS[i % CHART_COLORS.length],
          }))
        : CHANNEL_DATA

      return chartWrapper(
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
          {showTooltipEl && <Tooltip contentStyle={TOOLTIP_STYLE} />}
          {showLegend && <Legend wrapperStyle={{ fontSize: 10, color: '#8b93c8' }} />}
        </PieChart>
      )
    }

    if (chartType === 'bar_horizontal') {
      const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0
      const hData = isSpreadsheet
        ? data
        : AD_SPEND_DATA.map((d) => ({ platform: d.platform, spend: d.spend }))
      const hXKey = isSpreadsheet ? xKey : 'platform'
      const hYKey = isSpreadsheet ? yKey : 'spend'

      return chartWrapper(
        <BarChart data={hData} layout="vertical">
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />}
          {showAxes && <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />}
          {showAxes && <YAxis type="category" dataKey={hXKey} tick={AXIS_TICK} axisLine={false} tickLine={false} width={100} />}
          {showTooltipEl && <Tooltip contentStyle={TOOLTIP_STYLE} />}
          {showLegend && <Legend wrapperStyle={{ fontSize: 10, color: '#8b93c8' }} />}
          <Bar dataKey={hYKey} fill={primaryColor} radius={[0, 4, 4, 0]} />
        </BarChart>
      )
    }

    if (chartType === 'scatter') {
      const isSpreadsheet = (dataBinding?.source === 'spreadsheet' || dataBinding?.source === 'google_sheets') && (dataBinding.customData?.length ?? 0) > 0
      const sData = isSpreadsheet
        ? data.map((row) => ({ x: Number(row[xKey]) || 0, y: Number(row[yKey]) || 0 }))
        : SESSIONS_DATA.map((d) => ({ x: d.sessions, y: d.conversions }))

      return chartWrapper(
        <ScatterChart>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />}
          {showAxes && <XAxis dataKey="x" type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} name={xKey} />}
          {showAxes && <YAxis dataKey="y" type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} name={yKey} />}
          {showTooltipEl && <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: '3 3' }} />}
          <Scatter data={sData} fill={primaryColor} />
        </ScatterChart>
      )
    }

    if (chartType === 'bar') {
      return chartWrapper(
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />}
          {showAxes && <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />}
          {showAxes && <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />}
          {showTooltipEl && <Tooltip contentStyle={TOOLTIP_STYLE} />}
          {showLegend && <Legend wrapperStyle={{ fontSize: 10, color: '#8b93c8' }} />}
          <Bar dataKey={yKey} fill={primaryColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      )
    }

    if (chartType === 'line') {
      return chartWrapper(
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />}
          {showAxes && <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />}
          {showAxes && <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />}
          {showTooltipEl && <Tooltip contentStyle={TOOLTIP_STYLE} />}
          {showLegend && <Legend wrapperStyle={{ fontSize: 10, color: '#8b93c8' }} />}
          <Line type="monotone" dataKey={yKey} stroke={primaryColor} strokeWidth={isClassic ? 1.5 : 2} dot={!isClassic} />
        </LineChart>
      )
    }

    return chartWrapper(
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryColor} stopOpacity={isClassic ? 0.15 : 0.3} />
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${gradId}-2`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.2} />
            <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />}
        {showAxes && <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />}
        {showAxes && <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />}
        {showTooltipEl && <Tooltip contentStyle={TOOLTIP_STYLE} />}
        {showLegend && <Legend wrapperStyle={{ fontSize: 10, color: '#8b93c8' }} />}
        <Area type="monotone" dataKey={yKey} stroke={primaryColor} fill={`url(#${gradId})`} strokeWidth={isClassic ? 1.5 : 2} />
      </AreaChart>
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
            objectPosition: `${style.cropX ?? 50}% ${style.cropY ?? 50}%`,
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
        <ImageIcon size={24} color="rgba(255,255,255,0.25)" />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Nenhuma imagem</span>
      </div>
    )
  }

  return null
}
