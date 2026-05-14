import React, { useEffect, useRef, useState } from 'react'
import { Lock, ZoomIn, ZoomOut } from 'lucide-react'
import type { Slide, SlideElement } from '@/types'
import { SlideElementRenderer } from './SlideElementRenderer'

const CANVAS_W = 1280
const CANVAS_H = 720
const ZOOM_STEP = 0.15
const ZOOM_MIN = 0.25
const ZOOM_MAX = 3.0
const MIN_DIM = 20

type ResizeHandle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se'

const RESIZE_DEFS: Array<{ id: ResizeHandle; pos: React.CSSProperties; cursor: string }> = [
  { id: 'nw', pos: { top: -5, left: -5 }, cursor: 'nw-resize' },
  { id: 'n', pos: { top: -5, left: '50%', transform: 'translateX(-50%)' }, cursor: 'n-resize' },
  { id: 'ne', pos: { top: -5, right: -5 }, cursor: 'ne-resize' },
  { id: 'w', pos: { left: -5, top: '50%', transform: 'translateY(-50%)' }, cursor: 'w-resize' },
  { id: 'e', pos: { right: -5, top: '50%', transform: 'translateY(-50%)' }, cursor: 'e-resize' },
  { id: 'sw', pos: { bottom: -5, left: -5 }, cursor: 'sw-resize' },
  { id: 's', pos: { bottom: -5, left: '50%', transform: 'translateX(-50%)' }, cursor: 's-resize' },
  { id: 'se', pos: { bottom: -5, right: -5 }, cursor: 'se-resize' },
]

interface DragState { kind: 'drag'; px: number; py: number; ex: number; ey: number }
interface ResizeState { kind: 'resize'; h: ResizeHandle; px: number; py: number; ex: number; ey: number; ew: number; eh: number }
interface RotateState { kind: 'rotate'; cx: number; cy: number; startAngle: number; startRotation: number }
interface CropState { kind: 'crop'; px: number; py: number; startCropX: number; startCropY: number }
type Interaction = DragState | ResizeState | RotateState | CropState

const applyResize = (s: ResizeState, ptrX: number, ptrY: number, scale: number): Partial<SlideElement> => {
  const dx = (ptrX - s.px) / scale
  const dy = (ptrY - s.py) / scale
  let x = s.ex, y = s.ey, w = s.ew, h = s.eh

  if (s.h === 'nw' || s.h === 'w' || s.h === 'sw') {
    const nw = s.ew - dx
    w = Math.max(MIN_DIM, nw)
    x = nw < MIN_DIM ? s.ex + s.ew - MIN_DIM : s.ex + dx
  }
  if (s.h === 'ne' || s.h === 'e' || s.h === 'se') {
    w = Math.max(MIN_DIM, s.ew + dx)
  }
  if (s.h === 'nw' || s.h === 'n' || s.h === 'ne') {
    const nh = s.eh - dy
    h = Math.max(MIN_DIM, nh)
    y = nh < MIN_DIM ? s.ey + s.eh - MIN_DIM : s.ey + dy
  }
  if (s.h === 'sw' || s.h === 's' || s.h === 'se') {
    h = Math.max(MIN_DIM, s.eh + dy)
  }

  return { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) }
}

const applyRotation = (s: RotateState, ptrX: number, ptrY: number): number => {
  const current = Math.atan2(ptrY - s.cy, ptrX - s.cx) * (180 / Math.PI)
  return Math.round((s.startRotation + current - s.startAngle + 360) % 360)
}

interface ElementOverlayProps {
  element: SlideElement
  isSelected: boolean
  isInMultiSelect: boolean
  isCropMode: boolean
  isEditing: boolean
  scaleRef: { readonly current: number }
  canvasRef: { readonly current: HTMLDivElement | null }
  onSelect: (isShift: boolean) => void
  onEditStart: () => void
  onEditEnd: (content: string) => void
  onUpdate: (patch: Partial<SlideElement>) => void
  onInteractionStart: (kind: 'drag' | 'resize' | 'rotate') => void
  onDragDelta: (dx: number, dy: number) => void
  onEnterCrop: () => void
}

const ElementOverlay = ({
  element,
  isSelected,
  isInMultiSelect,
  isCropMode,
  isEditing,
  scaleRef,
  canvasRef,
  onSelect,
  onEditStart,
  onEditEnd,
  onUpdate,
  onInteractionStart,
  onDragDelta,
  onEnterCrop,
}: ElementOverlayProps) => {
  const interactionRef = useRef<Interaction | null>(null)
  const didDragRef = useRef(false)

  const handleDragDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (element.locked || isEditing) return
    e.stopPropagation()

    if (e.shiftKey) {
      onSelect(true)
      return
    }

    didDragRef.current = false
    e.currentTarget.setPointerCapture(e.pointerId)

    if (isCropMode && element.type === 'image') {
      interactionRef.current = {
        kind: 'crop',
        px: e.clientX, py: e.clientY,
        startCropX: element.style.cropX ?? 50,
        startCropY: element.style.cropY ?? 50,
      }
      return
    }

    onInteractionStart('drag')

    if (!isSelected) onSelect(false)
    interactionRef.current = { kind: 'drag', px: e.clientX, py: e.clientY, ex: element.x, ey: element.y }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = interactionRef.current
    if (!s) return
    const sc = scaleRef.current

    if (s.kind === 'drag') {
      didDragRef.current = true
      if (isInMultiSelect) {
        onDragDelta((e.clientX - s.px) / sc, (e.clientY - s.py) / sc)
      } else {
        onUpdate({ x: Math.round(s.ex + (e.clientX - s.px) / sc), y: Math.round(s.ey + (e.clientY - s.py) / sc) })
      }
    } else if (s.kind === 'crop') {
      const dx = (e.clientX - s.px) / sc
      const dy = (e.clientY - s.py) / sc
      const newX = Math.max(0, Math.min(100, s.startCropX + (dx / element.width) * 100))
      const newY = Math.max(0, Math.min(100, s.startCropY + (dy / element.height) * 100))
      onUpdate({ style: { ...element.style, cropX: newX, cropY: newY } })
    }
  }

  const handleResizeDown = (e: React.PointerEvent<HTMLDivElement>, handle: ResizeHandle) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    onInteractionStart('resize')
    interactionRef.current = {
      kind: 'resize', h: handle,
      px: e.clientX, py: e.clientY,
      ex: element.x, ey: element.y, ew: element.width, eh: element.height,
    }
  }

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = interactionRef.current
    if (s?.kind !== 'resize') return
    onUpdate(applyResize(s, e.clientX, e.clientY, scaleRef.current))
  }

  const handleRotateDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    onInteractionStart('rotate')
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const sc = scaleRef.current
    const cx = rect.left + (element.x + element.width / 2) * sc
    const cy = rect.top + (element.y + element.height / 2) * sc
    interactionRef.current = {
      kind: 'rotate', cx, cy,
      startAngle: Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI),
      startRotation: element.rotation,
    }
  }

  const handleRotateMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = interactionRef.current
    if (s?.kind !== 'rotate') return
    onUpdate({ rotation: applyRotation(s, e.clientX, e.clientY) })
  }

  const clearInteraction = () => {
    const s = interactionRef.current
    if (s?.kind === 'drag' && isInMultiSelect && !didDragRef.current) {
      onSelect(false)
    }
    interactionRef.current = null
    didDragRef.current = false
  }

  const outlineColor = isCropMode ? '#f59e0b' : '#4f63f7'

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        cursor: element.locked ? 'default'
          : isCropMode ? 'crosshair'
          : isEditing ? 'text'
          : 'move',
        userSelect: 'none',
        outline: isSelected && !isEditing ? `2px solid ${outlineColor}` : 'none',
        outlineOffset: 2,
        zIndex: element.zIndex,
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (!e.shiftKey && !isInMultiSelect) onSelect(false)
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        if (element.locked) return
        if (element.type === 'text') onEditStart()
        else if (element.type === 'image') onEnterCrop()
      }}
      onPointerDown={handleDragDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearInteraction}
    >
      <SlideElementRenderer element={element} />

      {element.locked && (
        <div style={{ position: 'absolute', top: 4, right: 4, pointerEvents: 'none' }}>
          <Lock size={11} color="rgba(255,255,255,0.55)" />
        </div>
      )}

      {isCropMode && (
        <div style={{
          position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(245,158,11,0.9)', borderRadius: 4, padding: '2px 8px',
          fontSize: 10, color: '#fff', whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          Recorte — Esc para sair
        </div>
      )}

      {isEditing && element.type === 'text' && (
        <textarea
          autoFocus
          defaultValue={element.content ?? ''}
          onBlur={(e) => onEditEnd(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') onEditEnd(element.content ?? '') }}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,12,30,0.9)',
            color: element.style.color ?? '#f0f2ff',
            fontSize: element.style.fontSize ?? 16,
            fontWeight: element.style.fontWeight ?? 'normal',
            textAlign: element.style.textAlign ?? 'left',
            padding: element.style.padding ?? 8,
            border: '2px solid #4f63f7', borderRadius: 4,
            outline: 'none', resize: 'none', zIndex: 9999,
            lineHeight: 1.3, fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
          }}
        />
      )}

      {isSelected && !isEditing && !isCropMode && (
        <>
          <div
            style={{
              position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              cursor: 'crosshair', pointerEvents: 'auto',
            }}
            onPointerDown={handleRotateDown}
            onPointerMove={handleRotateMove}
            onPointerUp={clearInteraction}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4f63f7', border: '2px solid white', flexShrink: 0 }} />
            <div style={{ width: 1, height: 20, background: '#4f63f7', flexShrink: 0 }} />
          </div>

          {RESIZE_DEFS.map(({ id, pos, cursor }) => (
            <div
              key={id}
              style={{
                position: 'absolute', width: 9, height: 9, borderRadius: 2,
                background: '#4f63f7', border: '1.5px solid white',
                cursor, zIndex: 10, ...pos,
              }}
              onPointerDown={(e) => handleResizeDown(e, id)}
              onPointerMove={handleResizeMove}
              onPointerUp={clearInteraction}
            />
          ))}
        </>
      )}
    </div>
  )
}

const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }: {
  zoom: number; onZoomIn: () => void; onZoomOut: () => void; onReset: () => void
}) => (
  <div style={{
    position: 'absolute', bottom: 12, right: 16,
    display: 'flex', alignItems: 'center', gap: 2,
    background: 'rgba(15,17,40,0.9)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '3px 6px', backdropFilter: 'blur(8px)',
  }}>
    <button
      onClick={onZoomOut}
      title="Zoom out (Ctrl+-)"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#8b93c8' }}
    >
      <ZoomOut size={13} />
    </button>
    <button
      onClick={onReset}
      title="Reset zoom (Ctrl+0)"
      style={{ fontSize: 11, color: '#8b93c8', background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 38, textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}
    >
      {Math.round(zoom * 100)}%
    </button>
    <button
      onClick={onZoomIn}
      title="Zoom in (Ctrl+=)"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#8b93c8' }}
    >
      <ZoomIn size={13} />
    </button>
  </div>
)

const StatusBar = ({ element, selectedCount }: { element: SlideElement | null; selectedCount: number }) => (
  <div style={{
    height: 28, padding: '0 16px',
    display: 'flex', alignItems: 'center', gap: 20,
    fontSize: 11, color: '#525878',
    borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
  }}>
    {selectedCount > 1 ? (
      <span style={{ color: '#8b93c8' }}>{selectedCount} elementos selecionados</span>
    ) : element ? (
      <>
        <span>X: <span style={{ color: '#8b93c8' }}>{element.x}</span></span>
        <span>Y: <span style={{ color: '#8b93c8' }}>{element.y}</span></span>
        <span>W: <span style={{ color: '#8b93c8' }}>{element.width}</span></span>
        <span>H: <span style={{ color: '#8b93c8' }}>{element.height}</span></span>
        {element.rotation !== 0 && (
          <span>R: <span style={{ color: '#8b93c8' }}>{element.rotation}°</span></span>
        )}
        {element.locked && <span style={{ color: '#f87171' }}>Bloqueado</span>}
      </>
    ) : (
      <span>{CANVAS_W} × {CANVAS_H} px</span>
    )}
  </div>
)

interface SlideCanvasProps {
  slide: Slide
  selectedElementIds: string[]
  cropElementId: string | null
  onSelectElement: (id: string, isShift: boolean) => void
  onSelectNone: () => void
  onUpdateElement: (elementId: string, patch: Partial<SlideElement>) => void
  onUpdateMultiple: (patches: Array<{ elementId: string; patch: Partial<SlideElement> }>) => void
  onInteractionStart: () => void
  onEnterCrop: (id: string) => void
  onExitCrop: () => void
}

export const SlideCanvas = ({
  slide,
  selectedElementIds,
  cropElementId,
  onSelectElement,
  onSelectNone,
  onUpdateElement,
  onUpdateMultiple,
  onInteractionStart,
  onEnterCrop,
  onExitCrop,
}: SlideCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasInnerRef = useRef<HTMLDivElement>(null)
  const [baseScale, setBaseScale] = useState(1)
  const [userZoom, setUserZoom] = useState(1)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)

  const effectiveScale = baseScale * userZoom
  const effectiveScaleRef = useRef(effectiveScale)
  const multiDragStartRef = useRef<Map<string, { x: number; y: number }> | null>(null)

  useEffect(() => { effectiveScaleRef.current = effectiveScale }, [effectiveScale])

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      setBaseScale(Math.min((width - 48) / CANVAS_W, (height - 48) / CANVAS_H))
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (e.key === '=' || e.key === '+') {
        e.preventDefault()
        setUserZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
      } else if (e.key === '-') {
        e.preventDefault()
        setUserZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
      } else if (e.key === '0') {
        e.preventDefault()
        setUserZoom(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleInteractionStart = (elementId: string, kind: 'drag' | 'resize' | 'rotate') => {
    onInteractionStart()
    if (kind === 'drag' && selectedElementIds.length > 1 && selectedElementIds.includes(elementId)) {
      multiDragStartRef.current = new Map(
        selectedElementIds.map((id) => {
          const el = slide.elements.find((e) => e.id === id)
          return [id, { x: el?.x ?? 0, y: el?.y ?? 0 }]
        })
      )
    } else {
      multiDragStartRef.current = null
    }
  }

  const handleDragDelta = (dx: number, dy: number) => {
    if (!multiDragStartRef.current) return
    const patches = Array.from(multiDragStartRef.current.entries()).map(([id, start]) => ({
      elementId: id,
      patch: { x: Math.round(start.x + dx), y: Math.round(start.y + dy) } as Partial<SlideElement>,
    }))
    onUpdateMultiple(patches)
  }

  const sorted = [...slide.elements]
    .filter((el) => el.visibility)
    .sort((a, b) => a.zIndex - b.zIndex)

  const selectedElement = slide.elements.find((el) => el.id === selectedElementIds[selectedElementIds.length - 1]) ?? null

  const boundingBox = selectedElementIds.length > 1
    ? (() => {
        const els = slide.elements.filter((el) => selectedElementIds.includes(el.id))
        if (els.length === 0) return null
        const xs = els.flatMap((el) => [el.x, el.x + el.width])
        const ys = els.flatMap((el) => [el.y, el.y + el.height])
        return {
          x: Math.min(...xs), y: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        }
      })()
    : null

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)]">
      <div
        ref={containerRef}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          style={{
            width: CANVAS_W * effectiveScale,
            height: CANVAS_H * effectiveScale,
            position: 'relative', flexShrink: 0, borderRadius: 12,
            overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div
            ref={canvasInnerRef}
            style={{
              width: CANVAS_W, height: CANVAS_H,
              transform: `scale(${effectiveScale})`, transformOrigin: 'top left',
              position: 'absolute', top: 0, left: 0,
              background: slide.background, overflow: 'hidden',
            }}
            onClick={() => { onSelectNone(); setEditingElementId(null); if (cropElementId) onExitCrop() }}
          >
            {sorted.map((element) => {
              const isInMultiSelect = selectedElementIds.includes(element.id) && selectedElementIds.length > 1
              return (
                <ElementOverlay
                  key={element.id}
                  element={element}
                  isSelected={selectedElementIds.includes(element.id)}
                  isInMultiSelect={isInMultiSelect}
                  isCropMode={cropElementId === element.id}
                  isEditing={editingElementId === element.id}
                  scaleRef={effectiveScaleRef}
                  canvasRef={canvasInnerRef}
                  onSelect={(isShift) => onSelectElement(element.id, isShift)}
                  onEditStart={() => setEditingElementId(element.id)}
                  onEditEnd={(content) => {
                    onUpdateElement(element.id, { content })
                    setEditingElementId(null)
                  }}
                  onUpdate={(patch) => onUpdateElement(element.id, patch)}
                  onInteractionStart={(kind) => handleInteractionStart(element.id, kind)}
                  onDragDelta={handleDragDelta}
                  onEnterCrop={() => onEnterCrop(element.id)}
                />
              )
            })}

            {boundingBox && (
              <div
                style={{
                  position: 'absolute',
                  left: boundingBox.x - 6,
                  top: boundingBox.y - 6,
                  width: boundingBox.width + 12,
                  height: boundingBox.height + 12,
                  border: '1.5px dashed rgba(79,99,247,0.5)',
                  borderRadius: 4,
                  pointerEvents: 'none',
                  zIndex: 99999,
                }}
              />
            )}
          </div>
        </div>

        <ZoomControls
          zoom={userZoom}
          onZoomIn={() => setUserZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
          onZoomOut={() => setUserZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
          onReset={() => setUserZoom(1)}
        />
      </div>

      <StatusBar element={selectedElement} selectedCount={selectedElementIds.length} />
    </div>
  )
}
