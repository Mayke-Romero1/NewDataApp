import { useEffect, useRef, useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Copy, Trash2, EyeOff, Eye, GripVertical } from 'lucide-react'
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
  onDuplicateSlide: (index: number) => void
  onDeleteSlide: (index: number) => void
  onReorderSlide: (from: number, to: number) => void
  onToggleSlideHidden: (index: number) => void
}

const SlideThumbnail = ({ slide }: { slide: Slide }) => (
  <div
    style={{
      width: THUMB_W, height: THUMB_H,
      position: 'relative', overflow: 'hidden',
      background: slide.background, flexShrink: 0,
    }}
  >
    <div
      style={{
        width: CANVAS_W, height: CANVAS_H,
        transform: `scale(${THUMB_SCALE})`, transformOrigin: 'top left',
        position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
      }}
    >
      {[...slide.elements]
        .filter((el) => el.visibility)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((element) => (
          <div
            key={element.id}
            style={{
              position: 'absolute', left: element.x, top: element.y,
              width: element.width, height: element.height,
              transform: `rotate(${element.rotation}deg)`, opacity: element.opacity,
            }}
          >
            <SlideElementRenderer element={element} />
          </div>
        ))}
    </div>
  </div>
)

interface ContextMenuState {
  index: number
  x: number
  y: number
}

export const SlideThumbnailStrip = ({
  slides,
  activeSlideIndex,
  isCollapsed,
  onSelectSlide,
  onAddSlide,
  onToggleCollapse,
  onDuplicateSlide,
  onDeleteSlide,
  onReorderSlide,
  onToggleSlideHidden,
}: SlideThumbnailStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  useEffect(() => {
    if (!contextMenu) return
    const close = () => setContextMenu(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [contextMenu])

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ index, x: e.clientX, y: e.clientY })
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragFrom(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(index)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragFrom !== null && dragFrom !== index) {
      onReorderSlide(dragFrom, index)
    }
    setDragFrom(null)
    setDragOver(null)
  }

  const handleDragEnd = () => {
    setDragFrom(null)
    setDragOver(null)
  }

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
    <div
      ref={stripRef}
      className="w-40 border-r border-[var(--border)] flex flex-col gap-2 p-3 overflow-y-auto bg-[var(--bg-secondary)] flex-shrink-0"
    >
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
        <div
          key={slide.id}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          onContextMenu={(e) => handleContextMenu(e, i)}
          className={cn(
            'group relative rounded-lg overflow-hidden border transition-all flex-shrink-0 cursor-pointer',
            i === activeSlideIndex
              ? 'border-brand-500 shadow-[0_0_0_2px_rgba(79,99,247,0.3)]'
              : dragOver === i
              ? 'border-brand-500 border-dashed'
              : 'border-[var(--border)] hover:border-[rgba(255,255,255,0.15)]',
            dragFrom === i && 'opacity-40',
            slide.hidden && 'opacity-50'
          )}
          style={{ width: THUMB_W, height: THUMB_H }}
          onClick={() => onSelectSlide(i)}
        >
          <SlideThumbnail slide={slide} />

          <span className="absolute bottom-1 right-1.5 text-[9px] text-[var(--text-muted)] bg-[rgba(0,0,0,0.5)] px-1 rounded">
            {i + 1}
          </span>

          {slide.hidden && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
              <EyeOff size={16} color="rgba(255,255,255,0.6)" />
            </div>
          )}

          <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
            <button
              title="Duplicar"
              onClick={(e) => { e.stopPropagation(); onDuplicateSlide(i) }}
              className="w-5 h-5 flex items-center justify-center rounded bg-black/60 hover:bg-[rgba(79,99,247,0.8)] text-white transition-colors"
            >
              <Copy size={10} />
            </button>
            {slides.length > 1 && (
              <button
                title="Excluir"
                onClick={(e) => { e.stopPropagation(); onDeleteSlide(i) }}
                className="w-5 h-5 flex items-center justify-center rounded bg-black/60 hover:bg-red-500/80 text-white transition-colors"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>

          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-white/40 hover:text-white/80">
            <GripVertical size={12} />
          </div>
        </div>
      ))}

      <button
        onClick={onAddSlide}
        className="border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)] transition-all flex-shrink-0"
        style={{ width: THUMB_W, height: THUMB_H }}
      >
        <Plus size={16} />
      </button>

      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 9999,
            background: '#1a1d2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 4,
            minWidth: 160,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            {
              label: 'Duplicar slide',
              icon: <Copy size={12} />,
              action: () => { onDuplicateSlide(contextMenu.index); setContextMenu(null) },
            },
            {
              label: slides[contextMenu.index]?.hidden ? 'Mostrar na apresentação' : 'Ocultar na apresentação',
              icon: slides[contextMenu.index]?.hidden ? <Eye size={12} /> : <EyeOff size={12} />,
              action: () => { onToggleSlideHidden(contextMenu.index); setContextMenu(null) },
            },
            ...(slides.length > 1 ? [{
              label: 'Excluir slide',
              icon: <Trash2 size={12} />,
              action: () => { onDeleteSlide(contextMenu.index); setContextMenu(null) },
              danger: true,
            }] : []),
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors text-left',
                item.danger
                  ? 'text-red-400 hover:bg-red-400/10'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
