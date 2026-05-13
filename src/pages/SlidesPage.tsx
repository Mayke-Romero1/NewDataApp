import {
  Plus, Presentation, Download, Share2, Play,
  Type, Image, BarChart2, Layers,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { Slide, SlideElement, SlideElementType } from '@/types'
import { SlideCanvas } from '@/components/slides/SlideCanvas'
import { SlideThumbnailStrip } from '@/components/slides/SlideThumbnailStrip'
import { SlideEditorPanel } from '@/components/slides/SlideEditorPanel'

const ELEMENT_TOOLS: { icon: React.ElementType; label: string; type: SlideElementType }[] = [
  { icon: Type, label: 'Texto', type: 'text' },
  { icon: Image, label: 'Imagem', type: 'image' },
  { icon: BarChart2, label: 'Gráfico', type: 'chart' },
  { icon: Layers, label: 'Shape', type: 'shape' },
]

const buildDefaultElement = (type: SlideElementType, zIndex: number): SlideElement => {
  const base = {
    id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    rotation: 0,
    opacity: 1,
    zIndex,
    visibility: true,
    locked: false,
  }

  switch (type) {
    case 'text':
      return {
        ...base, type,
        x: 240, y: 280, width: 800, height: 80,
        content: 'Texto',
        style: { color: '#f0f2ff', fontSize: 24, textAlign: 'center' },
      }
    case 'shape':
      return {
        ...base, type,
        x: 390, y: 210, width: 500, height: 300,
        style: { backgroundColor: 'rgba(79,99,247,0.15)', borderRadius: 12 },
      }
    case 'chart':
      return {
        ...base, type,
        x: 64, y: 64, width: 1152, height: 592,
        style: {},
        dataBinding: { source: 'ga4', metric: 'sessions', chartType: 'area' },
      }
    case 'kpi':
      return {
        ...base, type,
        x: 490, y: 210, width: 300, height: 200,
        style: {},
        dataBinding: { metric: 'sessions' },
      }
    case 'image':
      return {
        ...base, type,
        x: 240, y: 160, width: 800, height: 400,
        style: {},
      }
    default:
      return {
        ...base, type,
        x: 240, y: 280, width: 800, height: 200,
        style: {},
      }
  }
}

export const SlidesPage = () => {
  const {
    presentations,
    activePresentationId,
    setActivePresentation,
    createPresentation,
    addSlide,
    updateSlide,
    addElement,
    updateElement,
    removeElement,
    reorderElement,
  } = useAppStore()

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  const activePresentation = presentations.find((p) => p.id === activePresentationId) ?? presentations[0]
  const activeSlide = activePresentation?.slides[activeSlideIndex] ?? activePresentation?.slides[0]

  const handleSetActivePresentation = (id: string) => {
    setActivePresentation(id)
    setActiveSlideIndex(0)
    setSelectedElementId(null)
  }

  const handleAddSlide = () => {
    if (!activePresentation) return
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      index: activePresentation.slides.length,
      background: '#0d0f1a',
      elements: [],
    }
    addSlide(activePresentation.id, newSlide)
    setActiveSlideIndex(activePresentation.slides.length)
    setSelectedElementId(null)
  }

  const handleSelectSlide = (index: number) => {
    setActiveSlideIndex(index)
    setSelectedElementId(null)
  }

  const handleAddElement = (type: SlideElementType) => {
    if (!activePresentation || !activeSlide) return
    const maxZ = activeSlide.elements.reduce((m, el) => Math.max(m, el.zIndex), 0)
    const el = buildDefaultElement(type, maxZ + 1)
    addElement(activePresentation.id, activeSlide.id, el)
    setSelectedElementId(el.id)
  }

  const handleUpdateElement = (elementId: string, patch: Partial<SlideElement>) => {
    if (!activePresentation || !activeSlide) return
    updateElement(activePresentation.id, activeSlide.id, elementId, patch)
  }

  const handleDeleteElement = (elementId: string) => {
    if (!activePresentation || !activeSlide) return
    removeElement(activePresentation.id, activeSlide.id, elementId)
    setSelectedElementId(null)
  }

  const handleReorderElement = (elementId: string, direction: 'front' | 'back') => {
    if (!activePresentation || !activeSlide) return
    reorderElement(activePresentation.id, activeSlide.id, elementId, direction)
  }

  const handleUpdateSlide = (patch: { background?: string; notes?: string }) => {
    if (!activePresentation || !activeSlide) return
    updateSlide(activePresentation.id, activeSlide.id, patch)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
      const activeEl = document.activeElement?.tagName
      if (activeEl === 'INPUT' || activeEl === 'TEXTAREA' || activeEl === 'SELECT') return
      handleDeleteElement(selectedElementId)
    }
    if (e.key === 'Escape') {
      setSelectedElementId(null)
    }
  }

  if (!activePresentation || !activeSlide) return null

  return (
    <div
      className="flex h-full outline-none"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
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
            onClick={() => handleSetActivePresentation(p.id)}
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 border-b border-[var(--border)] flex items-center px-4 gap-3 flex-shrink-0">
          <div className="flex items-center gap-1">
            {ELEMENT_TOOLS.map(({ icon: Icon, label, type }) => (
              <button
                key={type}
                title={label}
                onClick={() => handleAddElement(type)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-[var(--border)]" />

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {activePresentation.updatedAt && (
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
          <SlideThumbnailStrip
            slides={activePresentation.slides}
            activeSlideIndex={activeSlideIndex}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
          />

          <SlideCanvas
            slide={activeSlide}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
          />

          <SlideEditorPanel
            slide={activeSlide}
            slideIndex={activeSlideIndex}
            slideCount={activePresentation.slides.length}
            selectedElementId={selectedElementId}
            onUpdateSlide={handleUpdateSlide}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onReorderElement={handleReorderElement}
          />
        </div>
      </div>
    </div>
  )
}
