import { useEffect, useRef, useState } from 'react'
import type { Slide, SlideElement } from '@/types'
import { SlideElementRenderer } from './SlideElementRenderer'

const CANVAS_W = 1280
const CANVAS_H = 720

interface DragState {
  elementId: string
  startPtrX: number
  startPtrY: number
  startElX: number
  startElY: number
}

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
  const [scale, setScale] = useState(1)
  const scaleRef = useRef(scale)
  const dragRef = useRef<DragState | null>(null)

  useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const scaleW = (width - 48) / CANVAS_W
      const scaleH = (height - 48) / CANVAS_H
      setScale(Math.min(scaleW, scaleH))
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const handleElementPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    element: SlideElement
  ) => {
    if (element.locked) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    onSelectElement(element.id)
    dragRef.current = {
      elementId: element.id,
      startPtrX: e.clientX,
      startPtrY: e.clientY,
      startElX: element.x,
      startElY: element.y,
    }
  }

  const handleElementPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    elementId: string
  ) => {
    if (!dragRef.current || dragRef.current.elementId !== elementId) return
    const s = scaleRef.current
    const dx = (e.clientX - dragRef.current.startPtrX) / s
    const dy = (e.clientY - dragRef.current.startPtrY) / s
    onUpdateElement(elementId, {
      x: Math.round(dragRef.current.startElX + dx),
      y: Math.round(dragRef.current.startElY + dy),
    })
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  const sorted = [...slide.elements]
    .filter((el) => el.visibility)
    .sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-[var(--bg-primary)] overflow-hidden"
    >
      <div
        style={{
          width: CANVAS_W * scale,
          height: CANVAS_H * scale,
          position: 'relative',
          flexShrink: 0,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
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
            overflow: 'hidden',
          }}
          onClick={() => onSelectElement(null)}
        >
          {sorted.map((element) => {
            const isSelected = selectedElementId === element.id
            return (
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
                  cursor: element.locked ? 'default' : 'move',
                  userSelect: 'none',
                  outline: isSelected ? '2px solid #4f63f7' : 'none',
                  outlineOffset: 2,
                  zIndex: element.zIndex,
                }}
                onClick={(e) => { e.stopPropagation(); onSelectElement(element.id) }}
                onPointerDown={(e) => handleElementPointerDown(e, element)}
                onPointerMove={(e) => handleElementPointerMove(e, element.id)}
                onPointerUp={handlePointerUp}
              >
                <SlideElementRenderer element={element} />

                {isSelected && (
                  <>
                    <div style={{ position: 'absolute', top: -5, left: -5, width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute', top: -5, right: -5, width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute', bottom: -5, left: -5, width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute', bottom: -5, right: -5, width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute', left: -5, top: '50%', transform: 'translateY(-50%)', width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                    <div style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', width: 9, height: 9, borderRadius: 2, background: '#4f63f7', border: '1.5px solid white' }} />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
