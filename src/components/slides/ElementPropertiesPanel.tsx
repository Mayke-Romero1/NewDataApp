import {
  BringToFront, SendToBack, Lock, Unlock, Eye, EyeOff,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Strikethrough, Droplet, Eraser,
  Trash2, Upload, X,
  Type, Square, Image as ImageIcon, BarChart2, TrendingUp,
  Maximize2, RotateCw, Layers, Palette, Hash, ChevronDown,
} from 'lucide-react'
import { useRef, useState } from 'react'
import type { SlideElement, SlideDataBinding, SlideElementStyle } from '@/types'
import { ColorPickerField } from './ColorPickerField'
import { cn } from '@/lib/utils'

interface ElementPropertiesPanelProps {
  element: SlideElement
  onUpdate: (patch: Partial<SlideElement>) => void
  onDelete: () => void
  onReorder: (direction: 'front' | 'back') => void
}

const AccordionSection = ({
  icon: Icon,
  label,
  defaultOpen = false,
  children,
}: {
  icon: React.ElementType
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-[var(--border)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 py-2.5 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors"
      >
        <Icon size={11} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown size={11} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-3 space-y-2">{children}</div>}
    </div>
  )
}

const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label?: string
  value: string
  onChange: (v: string) => void
}) => (
  <div>
    {label && <label className="text-[10px] text-[var(--text-muted)] block mb-1">{label}</label>}
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0.5 flex-shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value
          if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
        }}
        className="input text-xs h-7 py-0 px-2 font-mono flex-1 min-w-0"
        maxLength={7}
      />
    </div>
  </div>
)

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      'relative w-9 h-5 rounded-full transition-colors flex-shrink-0',
      checked ? 'bg-[#4f63f7]' : 'bg-[rgba(255,255,255,0.1)]'
    )}
  >
    <div className={cn(
      'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
      checked ? 'translate-x-4' : 'translate-x-0.5'
    )} />
  </button>
)

const ToggleRow = ({
  label,
  checked,
  onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <label className="text-[10px] text-[var(--text-muted)]">{label}</label>
    <Toggle checked={checked} onChange={onChange} />
  </div>
)

const SliderRow = ({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  display?: string
  onChange: (v: number) => void
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-[10px] text-[var(--text-muted)]">{label}</label>
      <span className="text-[10px] text-[var(--text-secondary)] font-mono">{display ?? value}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#4f63f7]"
    />
  </div>
)

const NumInput = ({
  label, value, onChange, min, max,
}: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number
}) => (
  <div>
    <label className="text-[10px] text-[var(--text-muted)] block mb-1">{label}</label>
    <input
      type="number"
      className="input text-xs h-7 py-0 px-2"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
)

const GradientControls = ({
  gradient,
  onChange,
}: {
  gradient: SlideElementStyle['gradient']
  onChange: (g: SlideElementStyle['gradient']) => void
}) => {
  const g = gradient ?? { enabled: false, type: 'linear' as const, angle: 135, colors: ['#4f63f7', '#22c55e'] as [string, string] }
  return (
    <div className="space-y-2">
      <ToggleRow label="Gradiente" checked={g.enabled} onChange={(v) => onChange({ ...g, enabled: v })} />
      {g.enabled && (
        <>
          <div className="flex gap-1">
            {(['linear', 'radial'] as const).map((t) => (
              <button key={t} onClick={() => onChange({ ...g, type: t })}
                className={cn('flex-1 h-7 text-[10px] rounded border transition-colors',
                  g.type === t ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}>
                {t === 'linear' ? 'Linear' : 'Radial'}
              </button>
            ))}
          </div>
          {g.type === 'linear' && (
            <SliderRow label="Ângulo" value={g.angle} min={0} max={360} display={`${g.angle}°`}
              onChange={(v) => onChange({ ...g, angle: v })} />
          )}
          <div className="grid grid-cols-2 gap-1.5">
            <ColorPicker label="Cor A" value={g.colors[0]} onChange={(v) => onChange({ ...g, colors: [v, g.colors[1]] })} />
            <ColorPicker label="Cor B" value={g.colors[1]} onChange={(v) => onChange({ ...g, colors: [g.colors[0], v] })} />
          </div>
        </>
      )}
    </div>
  )
}


const CHART_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'area', label: 'Área' },
  { value: 'bar', label: 'Barras verticais' },
  { value: 'line', label: 'Linha' },
  { value: 'bar_horizontal', label: 'Barras horizontais' },
  { value: 'pie', label: 'Pizza' },
  { value: 'donut', label: 'Rosca (Donut)' },
  { value: 'scatter', label: 'Dispersão' },
]

const FONT_OPTIONS = [
  { value: 'DM Sans, sans-serif', label: 'DM Sans' },
  { value: 'Sora, sans-serif', label: 'Sora' },
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'JetBrains Mono, monospace', label: 'JetBrains Mono' },
]

const KPI_ICON_OPTIONS: Array<{ value: NonNullable<SlideDataBinding['kpiIcon']>; label: string }> = [
  { value: 'trending_up', label: 'Tendência' },
  { value: 'users', label: 'Usuários' },
  { value: 'dollar', label: 'Moeda' },
  { value: 'target', label: 'Meta' },
  { value: 'bar_chart', label: 'Gráfico' },
]


export const ElementPropertiesPanel = ({
  element, onUpdate, onDelete, onReorder,
}: ElementPropertiesPanelProps) => {
  const { style, dataBinding } = element
  const db = dataBinding ?? {} as SlideDataBinding

  const [alignDropOpen, setAlignDropOpen] = useState(false)
  const alignDropRef = useRef<HTMLDivElement>(null)

  const updateStyle = (patch: Partial<SlideElementStyle>) =>
    onUpdate({ style: { ...style, ...patch } })

  const updateBinding = (patch: Partial<SlideDataBinding>) =>
    onUpdate({ dataBinding: { ...db, ...patch } })

  const handleTextDecoration = (decoration: 'underline' | 'line-through') =>
    updateStyle({ textDecoration: style.textDecoration === decoration ? 'none' : decoration })

  const handleClearFormatting = () =>
    updateStyle({ fontWeight: undefined, fontStyle: undefined, textDecoration: undefined, textAlign: undefined })

  const parseGradientStr = (v: string): { angle: number; c0: string; c1: string } => {
    const m = v.match(/linear-gradient\((\d+)deg,\s*(#[0-9a-fA-F]{3,6})\s*,\s*(#[0-9a-fA-F]{3,6})\)/)
    return m ? { angle: parseInt(m[1]), c0: m[2], c1: m[3] } : { angle: 135, c0: '#4f63f7', c1: '#22c55e' }
  }

  const bgColorValue = style.gradient?.enabled
    ? `linear-gradient(${style.gradient.angle}deg, ${style.gradient.colors[0]}, ${style.gradient.colors[1]})`
    : (style.backgroundColor ?? 'transparent')

  const handleBgColorChange = (v: string) => {
    if (v.startsWith('linear-gradient')) {
      const { angle, c0, c1 } = parseGradientStr(v)
      updateStyle({
        backgroundColor: undefined,
        gradient: { enabled: true, type: 'linear' as const, angle, colors: [c0, c1] as [string, string] },
      })
    } else {
      updateStyle({
        backgroundColor: v === 'transparent' ? undefined : v,
        gradient: style.gradient ? { ...style.gradient, enabled: false } : undefined,
      })
    }
  }

  const ALIGN_OPTIONS = [
    { value: 'left' as const, Icon: AlignLeft, label: 'Esquerda' },
    { value: 'center' as const, Icon: AlignCenter, label: 'Centro' },
    { value: 'right' as const, Icon: AlignRight, label: 'Direita' },
    { value: 'justify' as const, Icon: AlignJustify, label: 'Justificado' },
  ]
  const currentAlignOption = ALIGN_OPTIONS.find((o) => o.value === (style.textAlign ?? 'left')) ?? ALIGN_OPTIONS[0]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { onUpdate({ content: ev.target?.result as string }) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }


  return (
    <div className="space-y-0">

      <AccordionSection icon={Maximize2} label="Layout" defaultOpen>
        <div className="grid grid-cols-2 gap-1.5">
          <NumInput label="X" value={element.x} onChange={(v) => onUpdate({ x: v })} />
          <NumInput label="Y" value={element.y} onChange={(v) => onUpdate({ y: v })} />
          <NumInput label="Largura" value={element.width} onChange={(v) => onUpdate({ width: Math.max(10, v) })} min={10} />
          <NumInput label="Altura" value={element.height} onChange={(v) => onUpdate({ height: Math.max(10, v) })} min={10} />
        </div>
      </AccordionSection>

      <AccordionSection icon={RotateCw} label="Transformação">
        <NumInput label="Rotação (°)" value={element.rotation} onChange={(v) => onUpdate({ rotation: v })} />
        <SliderRow label="Opacidade" value={Math.round(element.opacity * 100)} min={0} max={100}
          display={`${Math.round(element.opacity * 100)}%`}
          onChange={(v) => onUpdate({ opacity: v / 100 })} />
      </AccordionSection>

      <AccordionSection icon={Layers} label="Camadas">
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={() => onReorder('front')} className="btn-secondary text-xs h-7 py-0 px-2 gap-1.5">
            <BringToFront size={12} /> Frente
          </button>
          <button onClick={() => onReorder('back')} className="btn-secondary text-xs h-7 py-0 px-2 gap-1.5">
            <SendToBack size={12} /> Fundo
          </button>
          <button
            onClick={() => onUpdate({ locked: !element.locked })}
            className={cn('btn-secondary text-xs h-7 py-0 px-2 gap-1.5', element.locked && 'border-[#4f63f7] text-[#748bff]')}
          >
            {element.locked ? <Lock size={12} /> : <Unlock size={12} />}
            {element.locked ? 'Bloqueado' : 'Livre'}
          </button>
          <button
            onClick={() => onUpdate({ visibility: !element.visibility })}
            className={cn('btn-secondary text-xs h-7 py-0 px-2 gap-1.5', !element.visibility && 'border-[#4f63f7] text-[#748bff]')}
          >
            {element.visibility ? <Eye size={12} /> : <EyeOff size={12} />}
            {element.visibility ? 'Visível' : 'Oculto'}
          </button>
        </div>
      </AccordionSection>

      {element.type === 'text' && (
        <>
          <AccordionSection icon={Type} label="Fonte" defaultOpen>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Tipo de fonte</label>
              <select className="input text-xs py-1.5 h-8" value={style.fontFamily ?? 'DM Sans, sans-serif'}
                onChange={(e) => updateStyle({ fontFamily: e.target.value })}>
                {FONT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <ColorPickerField
              label="Cor da fonte"
              value={style.color ?? '#f0f2ff'}
              onChange={(v) => updateStyle({ color: v })}
              allowGradient
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-[var(--text-muted)]">Tamanho</label>
                <input
                  type="number" min={8} max={200}
                  value={style.fontSize ?? 16}
                  onChange={(e) => updateStyle({ fontSize: Math.min(200, Math.max(8, Number(e.target.value))) })}
                  className="input text-[10px] h-6 py-0 px-1.5 w-14 font-mono text-right"
                />
              </div>
              <input
                type="range" min={8} max={200} value={style.fontSize ?? 16}
                onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
                className="w-full accent-[#4f63f7]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Formatação</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => updateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={cn('w-8 h-8 flex items-center justify-center rounded border transition-colors font-bold',
                    style.fontWeight === 'bold' ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}
                >
                  <Bold size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={cn('w-8 h-8 flex items-center justify-center rounded border transition-colors',
                    style.fontStyle === 'italic' ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}
                >
                  <Italic size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleTextDecoration('underline')}
                  className={cn('w-8 h-8 flex items-center justify-center rounded border transition-colors',
                    style.textDecoration === 'underline' ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}
                >
                  <Underline size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleTextDecoration('line-through')}
                  className={cn('w-8 h-8 flex items-center justify-center rounded border transition-colors',
                    style.textDecoration === 'line-through' ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}
                >
                  <Strikethrough size={13} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Alinhamento</label>
              <div className="relative" ref={alignDropRef}>
                <button
                  type="button"
                  onClick={() => setAlignDropOpen((v) => !v)}
                  className="flex items-center gap-2 w-full h-8 px-2.5 rounded border border-[var(--border)] hover:border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] transition-colors"
                >
                  <currentAlignOption.Icon size={13} className="text-[var(--text-secondary)]" />
                  <span className="text-xs text-[var(--text-secondary)] flex-1 text-left">{currentAlignOption.label}</span>
                  <ChevronDown size={10} className={cn('text-[var(--text-muted)] transition-transform', alignDropOpen && 'rotate-180')} />
                </button>
                {alignDropOpen && (
                  <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden">
                    {ALIGN_OPTIONS.map(({ value, Icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => { updateStyle({ textAlign: value }); setAlignDropOpen(false) }}
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors hover:bg-[var(--bg-glass)]',
                          style.textAlign === value ? 'text-[#748bff]' : 'text-[var(--text-secondary)]'
                        )}
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearFormatting}
              className="w-full btn-secondary text-xs h-8 py-0 gap-2"
            >
              <Eraser size={12} />
              Remover Formatação
            </button>

            <SliderRow label="Espaçamento" value={style.letterSpacing ?? 0} min={-2} max={10} step={0.5}
              display={`${(style.letterSpacing ?? 0)}px`}
              onChange={(v) => updateStyle({ letterSpacing: v })} />

            <div className="space-y-2">
              <ToggleRow label="Sombra de texto" checked={style.textShadow?.enabled ?? false}
                onChange={(v) => updateStyle({ textShadow: { enabled: v, color: style.textShadow?.color ?? '#000000', blur: style.textShadow?.blur ?? 4, offsetX: style.textShadow?.offsetX ?? 2, offsetY: style.textShadow?.offsetY ?? 2 } })} />
              {style.textShadow?.enabled && (
                <>
                  <ColorPicker label="Cor da sombra" value={style.textShadow.color}
                    onChange={(v) => updateStyle({ textShadow: { ...style.textShadow!, color: v } })} />
                  <SliderRow label="Blur" value={style.textShadow.blur} min={0} max={20}
                    display={`${style.textShadow.blur}px`}
                    onChange={(v) => updateStyle({ textShadow: { ...style.textShadow!, blur: v } })} />
                  <div className="grid grid-cols-2 gap-1.5">
                    <SliderRow label="Offset X" value={style.textShadow.offsetX} min={-20} max={20}
                      display={`${style.textShadow.offsetX}px`}
                      onChange={(v) => updateStyle({ textShadow: { ...style.textShadow!, offsetX: v } })} />
                    <SliderRow label="Offset Y" value={style.textShadow.offsetY} min={-20} max={20}
                      display={`${style.textShadow.offsetY}px`}
                      onChange={(v) => updateStyle({ textShadow: { ...style.textShadow!, offsetY: v } })} />
                  </div>
                </>
              )}
            </div>
          </AccordionSection>

          <AccordionSection icon={Maximize2} label="Padding" defaultOpen>
            <div className="grid grid-cols-2 gap-1.5">
              <NumInput label="Altura da linha" value={style.lineHeight ?? 24} onChange={(v) => updateStyle({ lineHeight: v })} min={0} />
              <NumInput label="Esquerda" value={style.paddingLeft ?? 8} onChange={(v) => updateStyle({ paddingLeft: v })} min={0} />
              <NumInput label="Direita" value={style.paddingRight ?? 8} onChange={(v) => updateStyle({ paddingRight: v })} min={0} />
              <NumInput label="Superior" value={style.paddingTop ?? 8} onChange={(v) => updateStyle({ paddingTop: v })} min={0} />
            </div>
          </AccordionSection>

          <AccordionSection icon={Palette} label="Plano de fundo" defaultOpen>
            <ColorPickerField
              label="Cenário"
              value={bgColorValue}
              onChange={handleBgColorChange}
              allowGradient
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Droplet size={10} className="text-[var(--text-muted)]" />
                  <label className="text-[10px] text-[var(--text-muted)]">Opacidade</label>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">{style.fillOpacity ?? 100}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={style.fillOpacity ?? 100}
                onChange={(e) => updateStyle({ fillOpacity: Number(e.target.value) })}
                className="w-full accent-[#4f63f7]"
              />
            </div>

            <ColorPickerField
              label="Cor da borda"
              value={style.borderColor ?? 'transparent'}
              onChange={(v) => updateStyle({ borderColor: v === 'transparent' ? undefined : v })}
            />

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Raio da borda</label>
              <select
                className="input text-xs py-1.5 h-8"
                value={style.borderRadius ?? 2}
                onChange={(e) => updateStyle({ borderRadius: Number(e.target.value) })}
              >
                {Array.from({ length: 51 }, (_, i) => i * 2).map((v) => (
                  <option key={v} value={v}>{v}px</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Espessura da borda</label>
              <select
                className="input text-xs py-1.5 h-8"
                value={style.borderWidth ?? 1}
                onChange={(e) => updateStyle({ borderWidth: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>{v}px</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Estilo da borda</label>
              <select
                className="input text-xs py-1.5 h-8"
                value={style.borderStyle ?? 'solid'}
                onChange={(e) => updateStyle({ borderStyle: e.target.value as SlideElementStyle['borderStyle'] })}
              >
                <option value="solid">Sólida</option>
                <option value="dashed">Tracejada</option>
                <option value="dotted">Pontilhada</option>
                <option value="double">Dupla</option>
              </select>
            </div>
          </AccordionSection>
        </>
      )}

      {element.type === 'shape' && (
        <AccordionSection icon={Square} label="Forma" defaultOpen>
          <ColorPicker label="Cor de preenchimento" value={style.backgroundColor ?? '#4f63f7'}
            onChange={(v) => updateStyle({ backgroundColor: v })} />

          <SliderRow label="Opacidade do preenchimento" value={style.fillOpacity ?? 100} min={0} max={100}
            display={`${style.fillOpacity ?? 100}%`}
            onChange={(v) => updateStyle({ fillOpacity: v })} />

          <GradientControls gradient={style.gradient}
            onChange={(g) => updateStyle({ gradient: g })} />

          <div className="space-y-2">
            <ToggleRow label="Borda" checked={(style.borderWidth ?? 0) > 0}
              onChange={(v) => updateStyle({ borderWidth: v ? 1 : 0 })} />
            {(style.borderWidth ?? 0) > 0 && (
              <>
                <ColorPicker label="Cor da borda" value={style.borderColor ?? '#4f63f7'}
                  onChange={(v) => updateStyle({ borderColor: v })} />
                <SliderRow label="Espessura" value={style.borderWidth ?? 1} min={1} max={10}
                  display={`${style.borderWidth ?? 1}px`}
                  onChange={(v) => updateStyle({ borderWidth: v })} />
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] block mb-1">Estilo</label>
                  <div className="flex gap-1">
                    {(['solid', 'dashed', 'dotted'] as const).map((s) => (
                      <button key={s} onClick={() => updateStyle({ borderStyle: s })}
                        className={cn('flex-1 h-7 text-[10px] rounded border transition-colors capitalize',
                          (style.borderStyle ?? 'solid') === s
                            ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]'
                            : 'border-[var(--border)] text-[var(--text-muted)]')}>
                        {s === 'solid' ? 'Sólida' : s === 'dashed' ? 'Tracejada' : 'Pontilhada'}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <SliderRow label="Borda arredondada" value={style.borderRadius ?? 0} min={0} max={80}
            display={`${style.borderRadius ?? 0}px`}
            onChange={(v) => updateStyle({ borderRadius: v })} />

          <div className="space-y-2">
            <ToggleRow label="Sombra" checked={style.boxShadow?.enabled ?? false}
              onChange={(v) => updateStyle({ boxShadow: { enabled: v, color: style.boxShadow?.color ?? 'rgba(0,0,0,0.4)', blur: style.boxShadow?.blur ?? 12, spread: style.boxShadow?.spread ?? 0, offsetX: style.boxShadow?.offsetX ?? 0, offsetY: style.boxShadow?.offsetY ?? 4 } })} />
            {style.boxShadow?.enabled && (
              <>
                <ColorPicker label="Cor da sombra" value={style.boxShadow.color}
                  onChange={(v) => updateStyle({ boxShadow: { ...style.boxShadow!, color: v } })} />
                <SliderRow label="Blur" value={style.boxShadow.blur} min={0} max={40}
                  display={`${style.boxShadow.blur}px`}
                  onChange={(v) => updateStyle({ boxShadow: { ...style.boxShadow!, blur: v } })} />
                <SliderRow label="Spread" value={style.boxShadow.spread} min={-20} max={20}
                  display={`${style.boxShadow.spread}px`}
                  onChange={(v) => updateStyle({ boxShadow: { ...style.boxShadow!, spread: v } })} />
                <div className="grid grid-cols-2 gap-1.5">
                  <SliderRow label="Offset X" value={style.boxShadow.offsetX} min={-20} max={20}
                    display={`${style.boxShadow.offsetX}px`}
                    onChange={(v) => updateStyle({ boxShadow: { ...style.boxShadow!, offsetX: v } })} />
                  <SliderRow label="Offset Y" value={style.boxShadow.offsetY} min={-20} max={20}
                    display={`${style.boxShadow.offsetY}px`}
                    onChange={(v) => updateStyle({ boxShadow: { ...style.boxShadow!, offsetY: v } })} />
                </div>
              </>
            )}
          </div>
        </AccordionSection>
      )}

      {element.type === 'image' && (
        <AccordionSection icon={ImageIcon} label="Imagem" defaultOpen>
          {element.content && (
            <div className="relative rounded-lg overflow-hidden border border-[var(--border)]" style={{ height: 72 }}>
              <img src={element.content} alt="" className="w-full h-full object-cover" />
              <button onClick={() => onUpdate({ content: undefined })}
                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded bg-black/60 hover:bg-black/80 text-white transition-colors">
                <X size={11} />
              </button>
            </div>
          )}
          <label className="btn-secondary text-xs h-8 py-0 w-full cursor-pointer flex items-center justify-center gap-1.5">
            <Upload size={12} />
            {element.content ? 'Trocar imagem' : 'Escolher imagem'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <SliderRow label="Borda arredondada" value={style.borderRadius ?? 8} min={0} max={80}
            display={`${style.borderRadius ?? 8}px`}
            onChange={(v) => updateStyle({ borderRadius: v })} />
        </AccordionSection>
      )}

      {element.type === 'kpi' && (
        <>
          <AccordionSection icon={TrendingUp} label="Dados KPI" defaultOpen>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Métrica</label>
              <select className="input text-xs py-1.5 h-8" value={db.metric ?? 'sessions'}
                onChange={(e) => updateBinding({ metric: e.target.value })}>
                <option value="sessions">Sessões</option>
                <option value="conversions">Conversões</option>
                <option value="cost">Custo Total Ads</option>
                <option value="roas">ROAS Médio</option>
              </select>
            </div>
          </AccordionSection>

          <AccordionSection icon={Hash} label="Formato KPI" defaultOpen>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Formato</label>
              <div className="flex gap-1">
                {(['number', 'currency', 'percent'] as const).map((fmt) => (
                  <button key={fmt} onClick={() => updateBinding({ valueFormat: fmt })}
                    className={cn('flex-1 h-7 text-[10px] rounded border transition-colors',
                      (db.valueFormat ?? 'number') === fmt
                        ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]'
                        : 'border-[var(--border)] text-[var(--text-muted)]')}>
                    {fmt === 'number' ? 'Nº' : fmt === 'currency' ? 'R$' : '%'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Casas decimais</label>
              <div className="flex gap-1">
                {([0, 1, 2] as const).map((d) => (
                  <button key={d} onClick={() => updateBinding({ decimalPlaces: d })}
                    className={cn('flex-1 h-7 text-[10px] rounded border transition-colors',
                      (db.decimalPlaces ?? 0) === d
                        ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]'
                        : 'border-[var(--border)] text-[var(--text-muted)]')}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <ToggleRow label="Compacto (K / M)" checked={db.compact !== false}
              onChange={(v) => updateBinding({ compact: v ? undefined : false })} />

            <ColorPicker label="Cor do valor" value={db.kpiValueColor ?? '#f0f2ff'}
              onChange={(v) => updateBinding({ kpiValueColor: v })} />

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Cor da variação</label>
              <div className="flex gap-1 mb-2">
                {(['auto', 'custom'] as const).map((m) => (
                  <button key={m} onClick={() => updateBinding({ kpiChangeColorMode: m })}
                    className={cn('flex-1 h-7 text-[10px] rounded border transition-colors capitalize',
                      (db.kpiChangeColorMode ?? 'auto') === m
                        ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]'
                        : 'border-[var(--border)] text-[var(--text-muted)]')}>
                    {m === 'auto' ? 'Auto' : 'Custom'}
                  </button>
                ))}
              </div>
              {db.kpiChangeColorMode === 'custom' && (
                <ColorPicker value={db.kpiChangeColor ?? '#22c55e'}
                  onChange={(v) => updateBinding({ kpiChangeColor: v })} />
              )}
            </div>

            <div className="space-y-2">
              <ToggleRow label="Ícone" checked={db.kpiShowIcon ?? false}
                onChange={(v) => updateBinding({ kpiShowIcon: v })} />
              {db.kpiShowIcon && (
                <div className="flex gap-1 flex-wrap">
                  {KPI_ICON_OPTIONS.map(({ value, label }) => (
                    <button key={value} onClick={() => updateBinding({ kpiIcon: value })}
                      title={label}
                      className={cn('flex-1 h-7 text-[10px] rounded border transition-colors min-w-[40px]',
                        db.kpiIcon === value
                          ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]'
                          : 'border-[var(--border)] text-[var(--text-muted)]')}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AccordionSection>

          <AccordionSection icon={Palette} label="Aparência KPI">
            <GradientControls gradient={style.gradient} onChange={(g) => updateStyle({ gradient: g })} />
            <div className="space-y-2">
              <ToggleRow label="Borda" checked={(style.borderWidth ?? 0) > 0}
                onChange={(v) => updateStyle({ borderWidth: v ? 1 : 0 })} />
              {(style.borderWidth ?? 0) > 0 && (
                <>
                  <ColorPicker label="Cor da borda" value={style.borderColor ?? '#4f63f7'}
                    onChange={(v) => updateStyle({ borderColor: v })} />
                  <SliderRow label="Espessura" value={style.borderWidth ?? 1} min={1} max={10}
                    display={`${style.borderWidth ?? 1}px`}
                    onChange={(v) => updateStyle({ borderWidth: v })} />
                </>
              )}
            </div>
            <SliderRow label="Borda arredondada" value={style.borderRadius ?? 12} min={0} max={40}
              display={`${style.borderRadius ?? 12}px`}
              onChange={(v) => updateStyle({ borderRadius: v })} />
          </AccordionSection>
        </>
      )}

      {element.type === 'chart' && (
        <>
          <AccordionSection icon={BarChart2} label="Dados do Gráfico" defaultOpen>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Tipo</label>
              <select className="input text-xs py-1.5 h-8" value={db.chartType ?? 'area'}
                onChange={(e) => updateBinding({ chartType: e.target.value as SlideDataBinding['chartType'] })}>
                {CHART_TYPE_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Período</label>
              <select className="input text-xs py-1.5 h-8" value={db.dateRange ?? 'last_30d'}
                onChange={(e) => updateBinding({ dateRange: e.target.value })}>
                <option value="last_7d">Últimos 7 dias</option>
                <option value="last_30d">Últimos 30 dias</option>
                <option value="last_90d">Últimos 90 dias</option>
              </select>
            </div>
          </AccordionSection>

          <AccordionSection icon={Palette} label="Aparência do Gráfico" defaultOpen>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Título</label>
              <input type="text" className="input text-xs h-8" placeholder="Título do gráfico…"
                value={db.chartTitle ?? ''}
                onChange={(e) => updateBinding({ chartTitle: e.target.value || undefined })} />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <ColorPicker label="Cor primária" value={db.primaryColor ?? '#4f63f7'}
                onChange={(v) => updateBinding({ primaryColor: v })} />
              <ColorPicker label="Cor secundária" value={db.secondaryColor ?? '#22c55e'}
                onChange={(v) => updateBinding({ secondaryColor: v })} />
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Estilo</label>
              <div className="flex gap-1">
                {(['modern', 'classic'] as const).map((s) => (
                  <button key={s} onClick={() => updateBinding({ chartStyle: s })}
                    className={cn('flex-1 h-7 text-[10px] rounded border transition-colors capitalize',
                      (db.chartStyle ?? 'modern') === s
                        ? 'bg-[rgba(79,99,247,0.2)] border-[#4f63f7] text-[#748bff]'
                        : 'border-[var(--border)] text-[var(--text-muted)]')}>
                    {s === 'modern' ? 'Moderno' : 'Clássico'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <ToggleRow label="Legenda" checked={db.showLegend ?? false} onChange={(v) => updateBinding({ showLegend: v })} />
              <ToggleRow label="Eixos" checked={db.showAxes !== false} onChange={(v) => updateBinding({ showAxes: v })} />
              <ToggleRow label="Grade" checked={db.showGrid ?? false} onChange={(v) => updateBinding({ showGrid: v })} />
              <ToggleRow label="Tooltip" checked={db.showTooltip !== false} onChange={(v) => updateBinding({ showTooltip: v })} />
              <ToggleRow label="Rótulos" checked={db.showLabels ?? false} onChange={(v) => updateBinding({ showLabels: v })} />
            </div>
          </AccordionSection>
        </>
      )}

      <div className="pt-3 border-t border-[var(--border)]">
        <button onClick={onDelete}
          className="w-full btn-secondary text-xs h-8 py-0 text-red-400 border-red-400/20 hover:border-red-400/50 hover:bg-red-400/10 gap-2">
          <Trash2 size={13} />
          Excluir elemento
        </button>
      </div>

    </div>
  )
}
