import {
  BringToFront, SendToBack, Lock, Unlock, Eye, EyeOff,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Trash2,
} from 'lucide-react'
import type { SlideElement } from '@/types'
import { cn } from '@/lib/utils'

interface ElementPropertiesPanelProps {
  element: SlideElement
  onUpdate: (patch: Partial<SlideElement>) => void
  onDelete: () => void
  onReorder: (direction: 'front' | 'back') => void
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{children}</p>
)

const NumInput = ({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
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

export const ElementPropertiesPanel = ({
  element,
  onUpdate,
  onDelete,
  onReorder,
}: ElementPropertiesPanelProps) => {
  const { style, dataBinding } = element

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Layout</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          <NumInput label="X" value={element.x} onChange={(v) => onUpdate({ x: v })} />
          <NumInput label="Y" value={element.y} onChange={(v) => onUpdate({ y: v })} />
          <NumInput label="Largura" value={element.width} onChange={(v) => onUpdate({ width: Math.max(10, v) })} min={10} />
          <NumInput label="Altura" value={element.height} onChange={(v) => onUpdate({ height: Math.max(10, v) })} min={10} />
        </div>
      </div>

      <div>
        <SectionLabel>Transformação</SectionLabel>
        <div className="space-y-2">
          <NumInput label="Rotação (°)" value={element.rotation} onChange={(v) => onUpdate({ rotation: v })} />
          <div>
            <label className="text-[10px] text-[var(--text-muted)] block mb-1">
              Opacidade — {Math.round(element.opacity * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(element.opacity * 100)}
              onChange={(e) => onUpdate({ opacity: Number(e.target.value) / 100 })}
              className="w-full accent-[#4f63f7]"
            />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Camadas</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onReorder('front')}
            className="btn-secondary text-xs h-7 py-0 px-2 gap-1.5"
            title="Trazer à frente"
          >
            <BringToFront size={12} /> Frente
          </button>
          <button
            onClick={() => onReorder('back')}
            className="btn-secondary text-xs h-7 py-0 px-2 gap-1.5"
            title="Enviar para trás"
          >
            <SendToBack size={12} /> Fundo
          </button>
          <button
            onClick={() => onUpdate({ locked: !element.locked })}
            className={cn('btn-secondary text-xs h-7 py-0 px-2 gap-1.5', element.locked && 'border-brand-500 text-brand-400')}
          >
            {element.locked ? <Lock size={12} /> : <Unlock size={12} />}
            {element.locked ? 'Bloqueado' : 'Livre'}
          </button>
          <button
            onClick={() => onUpdate({ visibility: !element.visibility })}
            className={cn('btn-secondary text-xs h-7 py-0 px-2 gap-1.5', !element.visibility && 'border-brand-500 text-brand-400')}
          >
            {element.visibility ? <Eye size={12} /> : <EyeOff size={12} />}
            {element.visibility ? 'Visível' : 'Oculto'}
          </button>
        </div>
      </div>

      {element.type === 'text' && (
        <div>
          <SectionLabel>Texto</SectionLabel>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Cor</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.color ?? '#f0f2ff'}
                  onChange={(e) => onUpdate({ style: { ...style, color: e.target.value } })}
                  className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0.5"
                />
                <span className="text-xs text-[var(--text-muted)] font-mono">{style.color ?? '#f0f2ff'}</span>
              </div>
            </div>
            <NumInput
              label="Tamanho (px)"
              value={style.fontSize ?? 16}
              onChange={(v) => onUpdate({ style: { ...style, fontSize: Math.max(8, v) } })}
              min={8}
            />
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Estilo</label>
              <div className="flex gap-1">
                <button
                  onClick={() => onUpdate({ style: { ...style, fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' } })}
                  className={cn('w-8 h-8 flex items-center justify-center rounded border transition-colors', style.fontWeight === 'bold' ? 'bg-[rgba(79,99,247,0.2)] border-brand-500 text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}
                >
                  <Bold size={13} />
                </button>
                <button
                  onClick={() => onUpdate({ style: { ...style, fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' } })}
                  className={cn('w-8 h-8 flex items-center justify-center rounded border transition-colors', style.fontStyle === 'italic' ? 'bg-[rgba(79,99,247,0.2)] border-brand-500 text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}
                >
                  <Italic size={13} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Alinhamento</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align, i) => {
                  const Icon = [AlignLeft, AlignCenter, AlignRight][i]
                  return (
                    <button
                      key={align}
                      onClick={() => onUpdate({ style: { ...style, textAlign: align } })}
                      className={cn('w-8 h-8 flex items-center justify-center rounded border transition-colors', style.textAlign === align ? 'bg-[rgba(79,99,247,0.2)] border-brand-500 text-[#748bff]' : 'border-[var(--border)] text-[var(--text-muted)]')}
                    >
                      <Icon size={13} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {element.type === 'shape' && (
        <div>
          <SectionLabel>Forma</SectionLabel>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Preenchimento</label>
              <input
                type="color"
                value={style.backgroundColor ?? '#4f63f7'}
                onChange={(e) => onUpdate({ style: { ...style, backgroundColor: e.target.value } })}
                className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent p-0.5"
              />
            </div>
            <NumInput
              label="Borda arredondada (px)"
              value={style.borderRadius ?? 0}
              onChange={(v) => onUpdate({ style: { ...style, borderRadius: Math.max(0, v) } })}
              min={0}
            />
          </div>
        </div>
      )}

      {element.type === 'kpi' && (
        <div>
          <SectionLabel>KPI</SectionLabel>
          <div>
            <label className="text-[10px] text-[var(--text-muted)] block mb-1">Métrica</label>
            <select
              className="input text-xs py-1.5 h-8"
              value={dataBinding?.metric ?? 'sessions'}
              onChange={(e) => onUpdate({ dataBinding: { ...dataBinding, metric: e.target.value } })}
            >
              <option value="sessions">Sessões</option>
              <option value="conversions">Conversões</option>
              <option value="cost">Custo Total Ads</option>
              <option value="roas">ROAS Médio</option>
            </select>
          </div>
        </div>
      )}

      {element.type === 'chart' && (
        <div>
          <SectionLabel>Gráfico</SectionLabel>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Tipo</label>
              <select
                className="input text-xs py-1.5 h-8"
                value={dataBinding?.chartType ?? 'area'}
                onChange={(e) => onUpdate({ dataBinding: { ...dataBinding, chartType: e.target.value as 'area' | 'bar' | 'line' } })}
              >
                <option value="area">Área</option>
                <option value="bar">Barras</option>
                <option value="line">Linha</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Período</label>
              <select
                className="input text-xs py-1.5 h-8"
                value={dataBinding?.dateRange ?? 'last_30d'}
                onChange={(e) => onUpdate({ dataBinding: { ...dataBinding, dateRange: e.target.value } })}
              >
                <option value="last_7d">Últimos 7 dias</option>
                <option value="last_30d">Últimos 30 dias</option>
                <option value="last_90d">Últimos 90 dias</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-[var(--border)]">
        <button
          onClick={onDelete}
          className="w-full btn-secondary text-xs h-8 py-0 text-red-400 border-red-400/20 hover:border-red-400/50 hover:bg-red-400/10 gap-2"
        >
          <Trash2 size={13} />
          Excluir elemento
        </button>
      </div>
    </div>
  )
}
