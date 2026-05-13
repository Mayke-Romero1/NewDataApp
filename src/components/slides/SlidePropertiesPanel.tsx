import type { Slide } from '@/types'

const THEMES = [
  { name: 'Dark Brand', bg: '#0d0f1a' },
  { name: 'Clean Light', bg: '#ffffff' },
  { name: 'Midnight', bg: '#0a0a14' },
  { name: 'Forest', bg: '#0d1a12' },
]

interface SlidePropertiesPanelProps {
  slide: Slide
  slideIndex: number
  slideCount: number
  onUpdateSlide: (patch: { background?: string; notes?: string }) => void
}

export const SlidePropertiesPanel = ({
  slide,
  slideIndex,
  slideCount,
  onUpdateSlide,
}: SlidePropertiesPanelProps) => (
  <div className="space-y-5">
    <div>
      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Tema</p>
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {THEMES.map((t) => (
          <button
            key={t.name}
            title={t.name}
            onClick={() => onUpdateSlide({ background: t.bg })}
            className="aspect-square rounded-lg border transition-colors hover:border-brand-500"
            style={{
              background: t.bg,
              borderColor: slide.background === t.bg ? '#4f63f7' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>
      <div>
        <label className="text-[10px] text-[var(--text-muted)] block mb-1">Cor personalizada</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={slide.background.startsWith('#') ? slide.background : '#0d0f1a'}
            onChange={(e) => onUpdateSlide({ background: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0.5"
          />
          <span className="text-xs text-[var(--text-muted)] font-mono">{slide.background}</span>
        </div>
      </div>
    </div>

    <div>
      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Slide</p>
      <p className="text-xs text-[var(--text-secondary)]">{slideIndex + 1} de {slideCount}</p>
    </div>

    <div>
      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Notas</p>
      <textarea
        className="input text-xs resize-none"
        rows={4}
        placeholder="Notas do apresentador..."
        value={slide.notes ?? ''}
        onChange={(e) => onUpdateSlide({ notes: e.target.value })}
      />
    </div>
  </div>
)
