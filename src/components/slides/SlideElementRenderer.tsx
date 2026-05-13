import { Image } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis,
} from 'recharts'
import type { SlideElement } from '@/types'
import { KPI_METRICS, SESSIONS_DATA } from '@/lib/mockData'

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
    const metric = METRIC_MAP[dataBinding?.metric ?? 'sessions'] ?? KPI_METRICS[0]
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
        <p style={{ fontSize: 12, color: '#8b93c8', margin: 0 }}>{metric.label}</p>
        <p style={{ fontSize: 32, fontWeight: 700, color: '#f0f2ff', margin: 0, fontFamily: 'Sora, sans-serif' }}>
          {metric.value}
        </p>
        <p style={{
          fontSize: 12,
          color: metric.changeDirection === 'up' ? '#22c55e' : '#ef4444',
          margin: 0,
        }}>
          {metric.change > 0 ? '+' : ''}{metric.change}% vs anterior
        </p>
      </div>
    )
  }

  if (type === 'chart') {
    const chartType = dataBinding?.chartType ?? 'area'
    const gradId = `grad-${element.id}`

    if (chartType === 'bar') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SESSIONS_DATA}>
              <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="sessions" fill="#4f63f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (chartType === 'line') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SESSIONS_DATA}>
              <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="sessions" stroke="#4f63f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SESSIONS_DATA}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f63f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f63f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="sessions" stroke="#4f63f7" fill={`url(#${gradId})`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'image') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: style.borderRadius ?? 8,
          border: '1px dashed rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image size={24} color="rgba(255,255,255,0.25)" />
      </div>
    )
  }

  return null
}
