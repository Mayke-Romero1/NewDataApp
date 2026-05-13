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
type Interaction = DragState | ResizeState | RotateState

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
  isEditing: boolean
  scaleRef: { readonly current: number }
  canvasRef: { readonly current: HTMLDivElement | null }
  onSelect: () => void
  onEditStart: () => void
  onEditEnd: (content: string) => void
  onUpdate: (patch: Partial<SlideElement>) => void
}

const ElementOverlay = ({
  element,
  isSelected,
  isEditing,
  scaleRef,
  canvasRef,
  onSelect,
  onEditStart,
  onEditEnd,
  onUpdate,
}: ElementOverlayProps) => {
  const interactionRef = useRef<Interaction | null>(null)

  const handleDragDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (element.locked || isEditing) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    onSelect()
    interactionRef.current = { kind: 'drag', px: e.clientX, py: e.clientY, ex: element.x, ey: element.y }
  }

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = interactionRef.current
    if (s?.kind !== 'drag') return
    const sc = scaleRef.current
    onUpdate({ x: Math.round(s.ex + (e.clientX - s.px) / sc), y: Math.round(s.ey + (e.clientY - s.py) / sc) })
  }

  const handleResizeDown = (e: React.PointerEvent<HTMLDivElement>, handle: ResizeHandle) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
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

  const clearInteraction = () => { interactionRef.current = null }

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
        cursor: element.locked ? 'default' : isEditing ? 'text' : 'move',
        userSelect: 'none',
        outline: isSelected && !isEditing ? '2px solid #4f63f7' : 'none',
        outlineOffset: 2,
        zIndex: element.zIndex,
      }}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onDoubleClick={(e) => {
        if (element.type !== 'text' || element.locked) return
        e.stopPropagation()
        onEditStart()
      }}
      onPointerDown={handleDragDown}
      onPointerMove={handleDragMove}
      onPointerUp={clearInteraction}
    >
      <SlideElementRenderer element={element} />

      {element.locked && (
        <div style={{ position: 'absolute', top: 4, right: 4, pointerEvents: 'none' }}>
          <Lock size={11} color="rgba(255,255,255,0.55)" />
        </div>
      )}

      {isEditing && element.type === 'text' && (
        <textarea
          autoFocus
          defaultValue={element.content ?? ''}
          onBlur={(e) => onEditEnd(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') onEditEnd(element.content ?? '') }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,12,30,0.9)',
            color: element.style.color ?? '#f0f2ff',
            fontSize: element.style.fontSize ?? 16,
            fontWeight: element.style.fontWeight ?? 'normal',
            textAlign: element.style.textAlign ?? 'left',
            padding: element.style.padding ?? 8,
            border: '2px solid #4f63f7',
            borderRadius: 4,
            outline: 'none',
            resize: 'none',
            zIndex: 9999,
            lineHeight: 1.3,
            fontFamily: 'DM Sans, sans-serif',
            boxSizing: 'border-box',
          }}
        />
      )}

      {isSelected && !isEditing && (
        <>
          <div
            style={{
              position: 'absolute',
              top: -32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'crosshair',
              pointerEvents: 'auto',
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
                position: 'absolute',
                width: 9,
                height: 9,
                borderRadius: 2,
                background: '#4f63f7',
                border: '1.5px solid white',
                cursor,
                zIndex: 10,
                ...pos,
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

interface ZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) => (
  <div
    style={{
      position: 'absolute',
      bottom: 12,
      right: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      background: 'rgba(15,17,40,0.9)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      padding: '3px 6px',
      backdropFilter: 'blur(8px)',
    }}
  >
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

interface StatusBarProps {
  element: SlideElement | null
}

const StatusBar = ({ element }: StatusBarProps) => (
  <div
    style={{
      height: 28,
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      fontSize: 11,
      color: '#525878',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
    }}
  >
    {element ? (
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
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (elementId: string, patch: Partial<SlideElement>) => void
}

export const SlideCanvas = ({
  slide,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
}: SlideCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasInnerRef = useRef<HTMLDivElement>(null)
  const [baseScale, setBaseScale] = useState(1)
  const [userZoom, setUserZoom] = useState(1)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)

  const effectiveScale = baseScale * userZoom
  const effectiveScaleRef = useRef(effectiveScale)

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
        setUserZoom(z => Math.min(ZOOM_MAX, z + ZOOM_STEP))
      } else if (e.key === '-') {
        e.preventDefault()
        setUserZoom(z => Math.max(ZOOM_MIN, z - ZOOM_STEP))
      } else if (e.key === '0') {
        e.preventDefault()
        setUserZoom(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const sorted = [...slide.elements]
    .filter(el => el.visibility)
    .sort((a, b) => a.zIndex - b.zIndex)

  const selectedElement = slide.elements.find(el => el.id === selectedElementId) ?? null

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)]">
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          style={{
            width: CANVAS_W * effectiveScale,
            height: CANVAS_H * effectiveScale,
            position: 'relative',
            flexShrink: 0,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div
            ref={canvasInnerRef}
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
              background: slide.background,
              overflow: 'hidden',
            }}
            onClick={() => { onSelectElement(null); setEditingElementId(null) }}
          >
            {sorted.map(element => (
              <ElementOverlay
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                isEditing={editingElementId === element.id}
                scaleRef={effectiveScaleRef}
                canvasRef={canvasInnerRef}
                onSelect={() => onSelectElement(element.id)}
                onEditStart={() => setEditingElementId(element.id)}
                onEditEnd={(content) => {
                  onUpdateElement(element.id, { content })
                  setEditingElementId(null)
                }}
                onUpdate={(patch) => onUpdateElement(element.id, patch)}
              />
            ))}
          </div>
        </div>

        <ZoomControls
          zoom={userZoom}
          onZoomIn={() => setUserZoom(z => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
          onZoomOut={() => setUserZoom(z => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
          onReset={() => setUserZoom(1)}
        />
      </div>

      <StatusBar element={selectedElement} />
    </div>
  )
}
