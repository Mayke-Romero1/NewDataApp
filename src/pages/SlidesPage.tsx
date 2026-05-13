import {
  Plus, Presentation, Download, Share2, Play,
  Type, Image, BarChart2, Layers,
  AlignLeft, Bold, Italic, Link
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { cn, formatRelativeTime } from '@/lib/utils'
import { KPI_METRICS, SESSIONS_DATA } from '@/lib/mockData'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis
} from 'recharts'

const SLIDE_THEMES = [
  { name: 'Dark Brand', bg: '#0d0f1a', accent: '#4f63f7' },
  { name: 'Clean Light', bg: '#ffffff', accent: '#4f63f7' },
  { name: 'Midnight', bg: '#0a0a14', accent: '#748bff' },
  { name: 'Forest', bg: '#0d1a12', accent: '#22c55e' },
]

const ELEMENT_TOOLS = [
  { icon: Type, label: 'Texto' },
  { icon: Image, label: 'Imagem' },
  { icon: BarChart2, label: 'Gráfico' },
  { icon: Layers, label: 'Shape' },
]

function MockSlideCanvas({ index }: { index: number; active?: boolean }) {
  const slides = [
    // Slide 1 — Title
    <div key={0} className="w-full h-full flex flex-col items-center justify-center gap-4 p-10">
      <span className="badge badge-brand text-xs">Relatório Mensal</span>
      <h2 className="font-display font-bold text-3xl text-center leading-tight">
        Performance de<br />Marketing — Maio 2025
      </h2>
      <p className="text-sm text-[var(--text-secondary)] text-center max-w-xs">
        Dados ao vivo integrados com GA4, Meta Ads e Google Ads
      </p>
      <div className="flex gap-3 mt-2">
        {KPI_METRICS.slice(0, 2).map((m) => (
          <div key={m.label} className="card py-2 px-4 text-center">
            <p className="text-xs text-[var(--text-muted)]">{m.label}</p>
            <p className="font-display font-bold text-lg text-[var(--text-primary)]">{m.value}</p>
          </div>
        ))}
      </div>
    </div>,
    // Slide 2 — Chart
    <div key={1} className="w-full h-full flex flex-col p-8 gap-4">
      <h2 className="font-display font-semibold text-xl">Sessões no período</h2>
      <p className="text-xs text-[var(--text-muted)]">Fonte: Google Analytics 4 — últimos 12 dias</p>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SESSIONS_DATA}>
            <defs>
              <linearGradient id="csGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f63f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f63f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#525878' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#13162a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
            <Area type="monotone" dataKey="sessions" stroke="#4f63f7" fill="url(#csGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>,
    // Slide 3 — KPIs
    <div key={2} className="w-full h-full flex flex-col p-8 gap-4">
      <h2 className="font-display font-semibold text-xl">KPIs do mês</h2>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {KPI_METRICS.map((m) => (
          <div key={m.label} className="card flex flex-col justify-center">
            <p className="text-xs text-[var(--text-muted)]">{m.label}</p>
            <p className="font-display font-bold text-2xl text-[var(--text-primary)]">{m.value}</p>
            <p className={cn('text-xs font-medium mt-0.5', m.changeDirection === 'up' ? 'text-green-400' : 'text-red-400')}>
              {m.change > 0 ? '+' : ''}{m.change}% vs anterior
            </p>
          </div>
        ))}
      </div>
    </div>,
  ]

  return slides[index % slides.length]
}

export function SlidesPage() {
  const { presentations, activePresentationId, setActivePresentation, createPresentation } = useAppStore()
  const activePresentation = presentations.find((p) => p.id === activePresentationId) ?? presentations[0]
  const [activeSlide, setActiveSlide] = useState(0)
  const slideCount = 3

  return (
    <div className="flex h-full">
      {/* Presentations list */}
      <aside className="w-52 border-r border-[var(--border)] flex flex-col py-4 px-3 gap-1 bg-[var(--bg-secondary)] flex-shrink-0">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Apresentações</span>
          <button
            onClick={() => createPresentation('Nova Apresentação')}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>
        {presentations.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePresentation(p.id)}
            className={cn(
              'sidebar-item w-full text-left text-xs',
              activePresentationId === p.id && 'active'
            )}
          >
            <Presentation size={14} className="flex-shrink-0" />
            <span className="truncate">{p.name}</span>
          </button>
        ))}
      </aside>

      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor toolbar */}
        <div className="h-12 border-b border-[var(--border)] flex items-center px-4 gap-3 flex-shrink-0">
          <div className="flex items-center gap-1">
            {ELEMENT_TOOLS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                title={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-[var(--border)]" />
          <div className="flex items-center gap-1">
            {[Bold, Italic, AlignLeft, Link].map((Icon, i) => (
              <button
                key={i}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {activePresentation?.updatedAt && (
              <span className="text-xs text-[var(--text-muted)]">
                Salvo {formatRelativeTime(activePresentation.updatedAt)}
              </span>
            )}
            <button className="btn-secondary text-xs h-8 py-0">
              <Share2 size={13} /> Compartilhar
            </button>
            <button className="btn-secondary text-xs h-8 py-0">
              <Download size={13} /> Exportar
            </button>
            <button className="btn-primary text-xs h-8 py-0">
              <Play size={13} /> Apresentar
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Slide thumbnails */}
          <div className="w-36 border-r border-[var(--border)] flex flex-col gap-2 p-3 overflow-y-auto bg-[var(--bg-secondary)] flex-shrink-0">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={cn(
                  'relative rounded-lg overflow-hidden border transition-all',
                  activeSlide === i
                    ? 'border-brand-500 shadow-[0_0_0_2px_rgba(79,99,247,0.3)]'
                    : 'border-[var(--border)] hover:border-[rgba(255,255,255,0.15)]'
                )}
                style={{ aspectRatio: '16/9' }}
              >
                <div className="absolute inset-0 bg-[var(--bg-primary)] flex items-center justify-center scale-[0.35] origin-top-left"
                  style={{ width: '285%', height: '285%' }}>
                  <MockSlideCanvas index={i} active={activeSlide === i} />
                </div>
                <span className="absolute bottom-1 right-1.5 text-[9px] text-[var(--text-muted)]">{i + 1}</span>
              </button>
            ))}
            <button className="border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)] transition-all"
              style={{ aspectRatio: '16/9' }}>
              <Plus size={16} />
            </button>
          </div>

          {/* Main canvas */}
          <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)] p-8 overflow-hidden">
            <div
              className="bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl"
              style={{
                width: '100%',
                maxWidth: 800,
                aspectRatio: '16/9',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <MockSlideCanvas index={activeSlide} active />
            </div>
          </div>

          {/* Properties panel */}
          <aside className="w-56 border-l border-[var(--border)] p-4 bg-[var(--bg-secondary)] flex-shrink-0 overflow-y-auto">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Propriedades</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Tema</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SLIDE_THEMES.map((t) => (
                    <button
                      key={t.name}
                      title={t.name}
                      className="w-full aspect-square rounded-lg border border-[var(--border)] hover:border-brand-500 transition-colors"
                      style={{ background: t.bg }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Fonte de dados</label>
                <select className="input text-xs py-1.5 h-8">
                  <option>Nenhuma</option>
                  <option>GA4 — Sessões</option>
                  <option>Meta Ads — ROAS</option>
                  <option>Google Ads — CPC</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Período</label>
                <select className="input text-xs py-1.5 h-8">
                  <option>Últimos 30 dias</option>
                  <option>Últimos 7 dias</option>
                  <option>Este mês</option>
                  <option>Mês anterior</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1.5">Slide {activeSlide + 1} de {slideCount}</label>
                <div className="flex gap-1">
                  <button
                    className="btn-secondary text-xs h-7 py-0 flex-1"
                    disabled={activeSlide === 0}
                    onClick={() => setActiveSlide((s) => Math.max(0, s - 1))}
                  >
                    Ant.
                  </button>
                  <button
                    className="btn-secondary text-xs h-7 py-0 flex-1"
                    disabled={activeSlide === slideCount - 1}
                    onClick={() => setActiveSlide((s) => Math.min(slideCount - 1, s + 1))}
                  >
                    Próx.
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
