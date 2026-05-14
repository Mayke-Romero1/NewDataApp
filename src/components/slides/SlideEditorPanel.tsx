import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Slide, SlideElement } from '@/types'
import { SlidePropertiesPanel } from './SlidePropertiesPanel'
import { ElementPropertiesPanel } from './ElementPropertiesPanel'

interface SlideEditorPanelProps {
  slide: Slide
  slideIndex: number
  slideCount: number
  selectedElementId: string | null
  isCollapsed: boolean
  onUpdateSlide: (patch: { background?: string; notes?: string }) => void
  onUpdateElement: (elementId: string, patch: Partial<SlideElement>) => void
  onDeleteElement: (elementId: string) => void
  onReorderElement: (elementId: string, direction: 'front' | 'back') => void
  onToggleCollapse: () => void
}

export const SlideEditorPanel = ({
  slide,
  slideIndex,
  slideCount,
  selectedElementId,
  isCollapsed,
  onUpdateSlide,
  onUpdateElement,
  onDeleteElement,
  onReorderElement,
  onToggleCollapse,
}: SlideEditorPanelProps) => {
  const selectedElement = selectedElementId
    ? slide.elements.find((el) => el.id === selectedElementId) ?? null
    : null

  if (isCollapsed) {
    return (
      <div className="w-8 border-l border-[var(--border)] flex flex-col items-center pt-3 bg-[var(--bg-secondary)] flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          title="Expandir editor"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
      </div>
    )
  }

  return (
    <aside className="w-[280px] border-l border-[var(--border)] p-4 bg-[var(--bg-secondary)] flex-shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {selectedElement ? 'Elemento' : 'Slide'}
        </h3>
        <button
          onClick={onToggleCollapse}
          title="Recolher editor"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {selectedElement ? (
        <ElementPropertiesPanel
          element={selectedElement}
          onUpdate={(patch) => onUpdateElement(selectedElement.id, patch)}
          onDelete={() => onDeleteElement(selectedElement.id)}
          onReorder={(dir) => onReorderElement(selectedElement.id, dir)}
        />
      ) : (
        <SlidePropertiesPanel
          slide={slide}
          slideIndex={slideIndex}
          slideCount={slideCount}
          onUpdateSlide={onUpdateSlide}
        />
      )}
    </aside>
  )
}
