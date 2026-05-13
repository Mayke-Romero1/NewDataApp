import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Slide } from '@/types'
import { cn } from '@/lib/utils'
import { SlideElementRenderer } from './SlideElementRenderer'

const THUMB_W = 144
const CANVAS_W = 1280
const CANVAS_H = 720
const THUMB_SCALE = THUMB_W / CANVAS_W
const THUMB_H = CANVAS_H * THUMB_SCALE

interface SlideThumbnailStripProps {
  slides: Slide[]
  activeSlideIndex: number
  isCollapsed: boolean
  onSelectSlide: (index: number) => void
  onAddSlide: () => void
  onToggleCollapse: () => void
}

const SlideThumbnail = ({ slide }: { slide: Slide }) => (
  <div
    style={{
      width: THUMB_W,
      height: THUMB_H,
      position: 'relative',
      overflow: 'hidden',
      background: slide.background,
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: CANVAS_W,
        height: CANVAS_H,
        transform: `scale(${THUMB_SCALE})`,
        transformOrigin: 'top left',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      {[...slide.elements]
        .filter((el) => el.visibility)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((element) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              transform: `rotate(${element.rotation}deg)`,
              opacity: element.opacity,
            }}
          >
            <SlideElementRenderer element={element} />
          </div>
        ))}
    </div>
  </div>
)

export const SlideThumbnailStrip = ({
  slides,
  activeSlideIndex,
  isCollapsed,
  onSelectSlide,
  onAddSlide,
  onToggleCollapse,
}: SlideThumbnailStripProps) => {
  if (isCollapsed) {
    return (
      <div className="w-8 border-r border-[var(--border)] flex flex-col items-center pt-3 bg-[var(--bg-secondary)] flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          title="Expandir miniaturas"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="w-40 border-r border-[var(--border)] flex flex-col gap-2 p-3 overflow-y-auto bg-[var(--bg-secondary)] flex-shrink-0">
      <div className="flex items-center justify-end mb-1 flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          title="Recolher miniaturas"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {slides.map((slide, i) => (
        <button
          key={slide.id}
          onClick={() => onSelectSlide(i)}
          className={cn(
            'relative rounded-lg overflow-hidden border transition-all flex-shrink-0',
            i === activeSlideIndex
              ? 'border-brand-500 shadow-[0_0_0_2px_rgba(79,99,247,0.3)]'
              : 'border-[var(--border)] hover:border-[rgba(255,255,255,0.15)]'
          )}
          style={{ width: THUMB_W, height: THUMB_H }}
        >
          <SlideThumbnail slide={slide} />
          <span className="absolute bottom-1 right-1.5 text-[9px] text-[var(--text-muted)] bg-[rgba(0,0,0,0.5)] px-1 rounded">
            {i + 1}
          </span>
        </button>
      ))}

      <button
        onClick={onAddSlide}
        className="border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)] transition-all flex-shrink-0"
        style={{ width: THUMB_W, height: THUMB_H }}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
