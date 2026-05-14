import {
  Download, Share2, Play, X, ChevronLeft, ChevronRight,
  Type, Image, BarChart2, Layers,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { formatRelativeTime } from '@/lib/utils'
import type { Slide, SlideElement, SlideElementType } from '@/types'
import { SlideCanvas } from '@/components/slides/SlideCanvas'
import { SlideThumbnailStrip } from '@/components/slides/SlideThumbnailStrip'
import { SlideEditorPanel } from '@/components/slides/SlideEditorPanel'
import { SlideElementRenderer } from '@/components/slides/SlideElementRenderer'

const CANVAS_W = 1280
const CANVAS_H = 720

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
        dataBinding: { source: 'demo', metric: 'sessions', chartType: 'area' },
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

interface PresentationOverlayProps {
  slides: Slide[]
  initialIndex: number
  onClose: () => void
}

const PresentationOverlay = ({ slides, initialIndex, onClose }: PresentationOverlayProps) => {
  const visibleSlides = slides.filter((s) => !s.hidden)
  const [index, setIndex] = useState(() => {
    const visIdx = visibleSlides.findIndex((s) => s.id === slides[initialIndex]?.id)
    return Math.max(0, visIdx)
  })
  const slide = visibleSlides[index]

  const goNext = () => setIndex((i) => Math.min(i + 1, visibleSlides.length - 1))
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!slide) return null

  const scale = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: CANVAS_W * scale,
          height: CANVAS_H * scale,
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            background: slide.background,
          }}
        >
          {[...slide.elements]
            .filter((el) => el.visibility)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((el) => (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation}deg)`,
                  opacity: el.opacity,
                }}
              >
                <SlideElementRenderer element={el} />
              </div>
            ))}
        </div>
      </div>

      <button
        onClick={onClose}
        title="Fechar (Esc)"
        style={{
          position: 'fixed', top: 16, right: 20, width: 36, height: 36,
          borderRadius: 8, background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={16} />
      </button>

      <button
        onClick={goPrev}
        disabled={index === 0}
        title="Slide anterior (←)"
        style={{
          position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)',
          width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: index === 0 ? 'rgba(255,255,255,0.25)' : '#fff',
          cursor: index === 0 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={goNext}
        disabled={index === visibleSlides.length - 1}
        title="Próximo slide (→)"
        style={{
          position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)',
          width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: index === visibleSlides.length - 1 ? 'rgba(255,255,255,0.25)' : '#fff',
          cursor: index === visibleSlides.length - 1 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ChevronRight size={20} />
      </button>

      <div
        style={{
          position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6, padding: '4px 12px',
          color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {index + 1} / {visibleSlides.length}
      </div>
    </div>
  )
}

export const SlidesPage = () => {
  const {
    presentations,
    activePresentationId,
    addSlide,
    updateSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlide,
    toggleSlideHidden,
    addElement,
    updateElement,
    removeElement,
    reorderElement,
    replaceSlideElements,
    updateMultipleElements,
    groupElements,
    ungroupElements,
  } = useAppStore()

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([])
  const [clipboard, setClipboard] = useState<SlideElement[] | null>(null)
  const [undoHistory, setUndoHistory] = useState<SlideElement[][]>([])
  const [cropElementId, setCropElementId] = useState<string | null>(null)
  const [isThumbnailCollapsed, setIsThumbnailCollapsed] = useState(false)
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false)
  const [isPresentMode, setIsPresentMode] = useState(false)

  const activePresentation = presentations.find((p) => p.id === activePresentationId) ?? presentations[0]
  const activeSlide = activePresentation?.slides[activeSlideIndex] ?? activePresentation?.slides[0]

  const activeSlidRef = useRef(activeSlide)
  useEffect(() => { activeSlidRef.current = activeSlide }, [activeSlide])

  const pushUndo = () => {
    const slide = activeSlidRef.current
    if (!slide) return
    setUndoHistory((prev) => [...prev.slice(-29), [...slide.elements]])
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
    setSelectedElementIds([])
  }

  const handleSelectSlide = (index: number) => {
    setActiveSlideIndex(index)
    setSelectedElementIds([])
    setCropElementId(null)
  }

  const handleDuplicateSlide = (index: number) => {
    if (!activePresentation) return
    duplicateSlide(activePresentation.id, index)
    setActiveSlideIndex(index + 1)
    setSelectedElementIds([])
  }

  const handleDeleteSlide = (index: number) => {
    if (!activePresentation) return
    deleteSlide(activePresentation.id, index)
    setActiveSlideIndex((prev) => Math.max(0, prev >= index ? prev - 1 : prev))
    setSelectedElementIds([])
  }

  const handleReorderSlide = (from: number, to: number) => {
    if (!activePresentation) return
    reorderSlide(activePresentation.id, from, to)
    if (activeSlideIndex === from) setActiveSlideIndex(to)
    else if (activeSlideIndex > from && activeSlideIndex <= to) setActiveSlideIndex((prev) => prev - 1)
    else if (activeSlideIndex < from && activeSlideIndex >= to) setActiveSlideIndex((prev) => prev + 1)
  }

  const handleToggleSlideHidden = (index: number) => {
    if (!activePresentation) return
    toggleSlideHidden(activePresentation.id, index)
  }

  const handleAddElement = (type: SlideElementType) => {
    if (!activePresentation || !activeSlide) return
    const maxZ = activeSlide.elements.reduce((m, el) => Math.max(m, el.zIndex), 0)
    const el = buildDefaultElement(type, maxZ + 1)
    pushUndo()
    addElement(activePresentation.id, activeSlide.id, el)
    setSelectedElementIds([el.id])
  }

  const handleUpdateElement = (elementId: string, patch: Partial<SlideElement>) => {
    if (!activePresentation || !activeSlide) return
    updateElement(activePresentation.id, activeSlide.id, elementId, patch)
  }

  const handleUpdateMultiple = (patches: Array<{ elementId: string; patch: Partial<SlideElement> }>) => {
    if (!activePresentation || !activeSlide) return
    updateMultipleElements(activePresentation.id, activeSlide.id, patches)
  }

  const handleDeleteElement = (elementId: string) => {
    if (!activePresentation || !activeSlide) return
    pushUndo()
    removeElement(activePresentation.id, activeSlide.id, elementId)
    setSelectedElementIds((prev) => prev.filter((id) => id !== elementId))
  }

  const handleReorderElement = (elementId: string, direction: 'front' | 'back') => {
    if (!activePresentation || !activeSlide) return
    reorderElement(activePresentation.id, activeSlide.id, elementId, direction)
  }

  const handleUpdateSlide = (patch: { background?: string; notes?: string }) => {
    if (!activePresentation || !activeSlide) return
    updateSlide(activePresentation.id, activeSlide.id, patch)
  }

  const expandGroupSelection = (ids: string[]): string[] => {
    if (!activeSlide) return ids
    const groupIds = ids
      .map((id) => activeSlide.elements.find((el) => el.id === id)?.groupId)
      .filter((g): g is string => !!g)
    if (groupIds.length === 0) return ids
    const groupMembers = activeSlide.elements
      .filter((el) => el.groupId && groupIds.includes(el.groupId))
      .map((el) => el.id)
    return [...new Set([...ids, ...groupMembers])]
  }

  const handleSelectElement = (id: string, isShift: boolean) => {
    const el = activeSlide?.elements.find((e) => e.id === id)
    if (isShift) {
      setSelectedElementIds((prev) => {
        if (prev.includes(id)) return prev.filter((eid) => eid !== id)
        const base = [...prev, id]
        return el?.groupId ? expandGroupSelection(base) : base
      })
    } else {
      if (el?.groupId) {
        const groupMembers = activeSlide!.elements
          .filter((e) => e.groupId === el.groupId)
          .map((e) => e.id)
        setSelectedElementIds(groupMembers)
      } else {
        setSelectedElementIds([id])
      }
    }
  }

  const handleGroupElements = () => {
    if (!activePresentation || !activeSlide || selectedElementIds.length < 2) return
    const selectedEls = activeSlide.elements.filter((el) => selectedElementIds.includes(el.id))
    const existingGroupId = selectedEls[0]?.groupId
    const allSameGroup = existingGroupId && selectedEls.every((el) => el.groupId === existingGroupId)
    if (allSameGroup) {
      ungroupElements(activePresentation.id, activeSlide.id, existingGroupId)
    } else {
      groupElements(activePresentation.id, activeSlide.id, selectedElementIds)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const activeEl = document.activeElement?.tagName
    const isInputFocused = activeEl === 'INPUT' || activeEl === 'TEXTAREA' || activeEl === 'SELECT'

    if (e.key === 'Escape') {
      if (cropElementId) { setCropElementId(null); return }
      setSelectedElementIds([])
      return
    }

    if (e.ctrlKey || e.metaKey) {
      if ((e.key === 'a' || e.key === 'A') && !isInputFocused) {
        e.preventDefault()
        setSelectedElementIds(activeSlide?.elements.map((el) => el.id) ?? [])
        return
      }
      if (e.key === 'c' && !isInputFocused) {
        e.preventDefault()
        const selected = activeSlide?.elements.filter((el) => selectedElementIds.includes(el.id)) ?? []
        if (selected.length > 0) setClipboard(selected)
        return
      }
      if (e.key === 'x' && !isInputFocused) {
        e.preventDefault()
        if (!activePresentation || !activeSlide) return
        const selected = activeSlide.elements.filter((el) => selectedElementIds.includes(el.id))
        if (selected.length === 0) return
        setClipboard(selected)
        pushUndo()
        selectedElementIds.forEach((id) => removeElement(activePresentation.id, activeSlide.id, id))
        setSelectedElementIds([])
        return
      }
      if (e.key === 'v' && !isInputFocused) {
        e.preventDefault()
        if (!activePresentation || !activeSlide || !clipboard || clipboard.length === 0) return
        pushUndo()
        const newIds: string[] = []
        clipboard.forEach((el) => {
          const newEl: SlideElement = {
            ...el,
            id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            x: el.x + 10,
            y: el.y + 10,
          }
          addElement(activePresentation.id, activeSlide.id, newEl)
          newIds.push(newEl.id)
        })
        setSelectedElementIds(newIds)
        return
      }
      if (e.key === 'z' && !isInputFocused) {
        e.preventDefault()
        if (!activePresentation || !activeSlide || undoHistory.length === 0) return
        const snapshot = undoHistory[undoHistory.length - 1]
        setUndoHistory((prev) => prev.slice(0, -1))
        replaceSlideElements(activePresentation.id, activeSlide.id, snapshot)
        setSelectedElementIds([])
        return
      }
      if ((e.key === 'g' || e.key === 'G') && !isInputFocused) {
        e.preventDefault()
        handleGroupElements()
        return
      }
      return
    }

    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0 && !isInputFocused) {
      if (!activePresentation || !activeSlide) return
      pushUndo()
      selectedElementIds.forEach((id) => removeElement(activePresentation.id, activeSlide.id, id))
      setSelectedElementIds([])
    }
  }

  if (!activePresentation || !activeSlide) return null

  const selectedElementId = selectedElementIds[selectedElementIds.length - 1] ?? null

  return (
    <div
      className="flex-1 flex h-full outline-none"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {isPresentMode && (
        <PresentationOverlay
          slides={activePresentation.slides}
          initialIndex={activeSlideIndex}
          onClose={() => setIsPresentMode(false)}
        />
      )}

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
            <button
              onClick={() => setIsPresentMode(true)}
              className="btn-primary text-xs h-8 py-0"
            >
              <Play size={13} /> Apresentar
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <SlideThumbnailStrip
            slides={activePresentation.slides}
            activeSlideIndex={activeSlideIndex}
            isCollapsed={isThumbnailCollapsed}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
            onToggleCollapse={() => setIsThumbnailCollapsed((v) => !v)}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onReorderSlide={handleReorderSlide}
            onToggleSlideHidden={handleToggleSlideHidden}
          />

          <SlideCanvas
            slide={activeSlide}
            selectedElementIds={selectedElementIds}
            cropElementId={cropElementId}
            onSelectElement={handleSelectElement}
            onSelectNone={() => { setSelectedElementIds([]); setCropElementId(null) }}
            onUpdateElement={handleUpdateElement}
            onUpdateMultiple={handleUpdateMultiple}
            onInteractionStart={pushUndo}
            onEnterCrop={(id) => setCropElementId(id)}
            onExitCrop={() => setCropElementId(null)}
            onGroupElements={handleGroupElements}
            onDeleteSelected={() => {
              if (!activePresentation || !activeSlide || selectedElementIds.length === 0) return
              pushUndo()
              selectedElementIds.forEach((id) => removeElement(activePresentation.id, activeSlide.id, id))
              setSelectedElementIds([])
            }}
            onCopySelected={() => {
              const selected = activeSlide?.elements.filter((el) => selectedElementIds.includes(el.id)) ?? []
              if (selected.length > 0) setClipboard(selected)
            }}
          />

          <SlideEditorPanel
            slide={activeSlide}
            slideIndex={activeSlideIndex}
            slideCount={activePresentation.slides.length}
            selectedElementId={selectedElementId}
            isCollapsed={isEditorCollapsed}
            onUpdateSlide={handleUpdateSlide}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onReorderElement={handleReorderElement}
            onToggleCollapse={() => setIsEditorCollapsed((v) => !v)}
          />
        </div>
      </div>
    </div>
  )
}
