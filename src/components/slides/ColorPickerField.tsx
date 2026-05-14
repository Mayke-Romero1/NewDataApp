import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface ColorPickerFieldProps {
  value: string
  onChange: (v: string) => void
  label?: string
  allowGradient?: boolean
}

const PRESET_COLORS = ['#4f63f7', '#22c55e', '#f59e0b', '#ef4444', '#f0f2ff', '#0d0f1a', '#748bff', '#8b93c8']

const isGradient = (v: string) => typeof v === 'string' && v.startsWith('linear-gradient')

const parseGradient = (v: string): { angle: number; colorStart: string; colorEnd: string } => {
  const match = v.match(/linear-gradient\((\d+)deg,\s*(#[0-9a-fA-F]{3,6})\s*,\s*(#[0-9a-fA-F]{3,6})\)/)
  return match
    ? { angle: parseInt(match[1]), colorStart: match[2], colorEnd: match[3] }
    : { angle: 135, colorStart: '#4f63f7', colorEnd: '#22c55e' }
}

const buildGradient = (angle: number, colorStart: string, colorEnd: string) =>
  `linear-gradient(${angle}deg, ${colorStart}, ${colorEnd})`

export const ColorPickerField = ({ value, onChange, label, allowGradient = false }: ColorPickerFieldProps) => {
  const { recentColors, addRecentColor } = useAppStore()

  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'solid' | 'gradient'>(() => isGradient(value) ? 'gradient' : 'solid')
  const [hexInput, setHexInput] = useState(() => (isGradient(value) || value === 'transparent' || !value) ? '' : value)

  const grad = isGradient(value) ? parseGradient(value) : { angle: 135, colorStart: '#4f63f7', colorEnd: '#22c55e' }
  const [gradAngle, setGradAngle] = useState(grad.angle)
  const [gradStart, setGradStart] = useState(grad.colorStart)
  const [gradEnd, setGradEnd] = useState(grad.colorEnd)

  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  const handleSelectColor = (color: string) => {
    onChange(color)
    if (color !== 'transparent' && !isGradient(color)) {
      setHexInput(color)
      addRecentColor(color)
    }
  }

  const handleHexChange = (v: string) => {
    setHexInput(v)
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange(v)
      addRecentColor(v)
    }
  }

  const handleGradientEmit = (angle: number, start: string, end: string) => {
    onChange(buildGradient(angle, start, end))
  }

  const currentColorForPicker =
    isGradient(value) || value === 'transparent' || !value ? '#4f63f7' : value

  const displayText =
    !value || value === 'transparent' ? 'Transparente'
    : isGradient(value) ? 'Gradiente'
    : value

  const displayBg =
    !value || value === 'transparent' ? undefined
    : value

  return (
    <div className="space-y-1">
      {label && <label className="text-[10px] text-[var(--text-muted)] block">{label}</label>}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2 w-full h-8 px-2 rounded border border-[var(--border)] hover:border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] transition-colors"
        >
          <div
            className="w-5 h-5 rounded flex-shrink-0 border border-[rgba(255,255,255,0.15)]"
            style={displayBg ? { background: displayBg } : { background: 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 0 0/8px 8px' }}
          />
          <span className="text-[10px] font-mono text-[var(--text-secondary)] flex-1 text-left truncate">{displayText}</span>
          <ChevronDown size={10} className={cn('text-[var(--text-muted)] transition-transform flex-shrink-0', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute z-[200] top-full mt-1 right-0 w-56 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl p-3 space-y-3"
          >
            {allowGradient && (
              <div className="flex gap-1">
                {(['solid', 'gradient'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m)
                      if (m === 'gradient') handleGradientEmit(gradAngle, gradStart, gradEnd)
                    }}
                    className={cn(
                      'flex-1 h-6 text-[10px] rounded border transition-colors',
                      mode === m
                        ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
                    )}
                  >
                    {m === 'solid' ? 'Sólida' : 'Gradiente'}
                  </button>
                ))}
              </div>
            )}

            {mode === 'solid' && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={currentColorForPicker}
                    onChange={(e) => handleSelectColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0.5 flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={hexInput}
                    placeholder="#000000"
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="input text-[10px] h-7 py-0 px-2 font-mono flex-1 min-w-0"
                    maxLength={7}
                  />
                </div>

                <div className="grid grid-cols-8 gap-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onClick={() => handleSelectColor(c)}
                      className={cn(
                        'w-5 h-5 rounded border transition-all hover:scale-110',
                        value === c ? 'border-white scale-110' : 'border-[rgba(255,255,255,0.1)]'
                      )}
                      style={{ background: c }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => { handleSelectColor('transparent'); setIsOpen(false) }}
                  className="w-full h-6 text-[10px] rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[rgba(255,255,255,0.2)] transition-colors"
                >
                  Transparente
                </button>
              </div>
            )}

            {mode === 'gradient' && (
              <div className="space-y-2">
                <div
                  className="w-full h-8 rounded border border-[var(--border)]"
                  style={{ background: buildGradient(gradAngle, gradStart, gradEnd) }}
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-[var(--text-muted)]">Ângulo</label>
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">{gradAngle}°</span>
                  </div>
                  <input
                    type="range" min={0} max={360} value={gradAngle}
                    onChange={(e) => {
                      const a = Number(e.target.value)
                      setGradAngle(a)
                      handleGradientEmit(a, gradStart, gradEnd)
                    }}
                    className="w-full accent-[#4f63f7]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] block mb-1">Início</label>
                    <input
                      type="color" value={gradStart}
                      onChange={(e) => {
                        setGradStart(e.target.value)
                        handleGradientEmit(gradAngle, e.target.value, gradEnd)
                      }}
                      className="w-full h-7 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] block mb-1">Fim</label>
                    <input
                      type="color" value={gradEnd}
                      onChange={(e) => {
                        setGradEnd(e.target.value)
                        handleGradientEmit(gradAngle, gradStart, e.target.value)
                      }}
                      className="w-full h-7 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {recentColors.length > 0 && (
              <div>
                <label className="text-[10px] text-[var(--text-muted)] block mb-1.5">Recentes</label>
                <div className="flex gap-1 flex-wrap">
                  {recentColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onClick={() => handleSelectColor(c)}
                      className={cn(
                        'w-5 h-5 rounded border transition-all hover:scale-110',
                        value === c ? 'border-white scale-110' : 'border-[rgba(255,255,255,0.1)]'
                      )}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
