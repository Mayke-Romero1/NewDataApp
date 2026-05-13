import type { Slide, SlideElement } from '@/types'
import { SlidePropertiesPanel } from './SlidePropertiesPanel'
import { ElementPropertiesPanel } from './ElementPropertiesPanel'

interface SlideEditorPanelProps {
  slide: Slide
  slideIndex: number
  slideCount: number
  selectedElementId: string | null
  onUpdateSlide: (patch: { background?: string; notes?: string }) => void
  onUpdateElement: (elementId: string, patch: Partial<SlideElement>) => void
  onDeleteElement: (elementId: string) => void
  onReorderElement: (elementId: string, direction: 'front' | 'back') => void
}

export const SlideEditorPanel = ({
  slide,
  slideIndex,
  slideCount,
  selectedElementId,
  onUpdateSlide,
  onUpdateElement,
  onDeleteElement,
  onReorderElement,
}: SlideEditorPanelProps) => {
  const selectedElement = selectedElementId
    ? slide.elements.find((el) => el.id === selectedElementId) ?? null
    : null

  return (
    <aside className="w-56 border-l border-[var(--border)] p-4 bg-[var(--bg-secondary)] flex-shrink-0 overflow-y-auto">
      <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
        {selectedElement ? 'Elemento' : 'Slide'}
      </h3>

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
