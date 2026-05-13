import {
  BringToFront, SendToBack, Lock, Unlock, Eye, EyeOff,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Trash2,
  Upload, X,
} from 'lucide-react'
import type { SlideElement, SlideDataBinding } from '@/types'
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

const SourceToggle = ({
  value, onChange,
}: { value: 'demo' | 'spreadsheet'; onChange: (v: 'demo' | 'spreadsheet') => void }) => (
  <div className="flex gap-1">
    {(['demo', 'spreadsheet'] as const).map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className={cn(
          'flex-1 h-7 text-[10px] rounded border transition-colors',
          value === s
            ? 'bg-[rgba(79,99,247,0.2)] border-brand-500 text-[#748bff]'
            : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
        )}
      >
        {s === 'demo' ? 'Demo' : 'Planilha'}
      </button>
    ))}
  </div>
)

const parseCSV = (text: string): Record<string, unknown>[] => {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
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

export const ElementPropertiesPanel = ({
  element,
  onUpdate,
  onDelete,
  onReorder,
}: ElementPropertiesPanelProps) => {
  const { style, dataBinding } = element
  const db = dataBinding ?? {} as SlideDataBinding
  const source = db.source ?? 'demo'
  const customData = db.customData ?? []
  const columns = customData.length > 0 ? Object.keys(customData[0]) : []

  const updateBinding = (patch: Partial<SlideDataBinding>) =>
    onUpdate({ dataBinding: { ...db, ...patch } })

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseCSV((ev.target?.result as string) ?? '')
      if (parsed.length === 0) return
      const cols = Object.keys(parsed[0])
      updateBinding({
        source: 'spreadsheet',
        customData: parsed,
        xKey: cols[0],
        yKey: cols[1] ?? cols[0],
      })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onUpdate({ content: ev.target?.result as string })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

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
          <button onClick={() => onReorder('front')} className="btn-secondary text-xs h-7 py-0 px-2 gap-1.5" title="Trazer à frente">
            <BringToFront size={12} /> Frente
          </button>
          <button onClick={() => onReorder('back')} className="btn-secondary text-xs h-7 py-0 px-2 gap-1.5" title="Enviar para trás">
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

      {element.type === 'image' && (
        <div>
          <SectionLabel>Imagem</SectionLabel>
          <div className="space-y-2">
            {element.content && (
              <div className="relative rounded-lg overflow-hidden border border-[var(--border)]" style={{ height: 72 }}>
                <img src={element.content} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => onUpdate({ content: undefined })}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded bg-black/60 hover:bg-black/80 text-white transition-colors"
                  title="Remover imagem"
                >
                  <X size={11} />
                </button>
              </div>
            )}
            <label className="btn-secondary text-xs h-8 py-0 w-full cursor-pointer flex items-center justify-center gap-1.5">
              <Upload size={12} />
              {element.content ? 'Trocar imagem' : 'Escolher imagem'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      )}

      {element.type === 'kpi' && (
        <div>
          <SectionLabel>KPI</SectionLabel>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Fonte de dados</label>
              <SourceToggle value={source} onChange={(s) => updateBinding({ source: s })} />
            </div>

            {source !== 'spreadsheet' ? (
              <div>
                <label className="text-[10px] text-[var(--text-muted)] block mb-1">Métrica</label>
                <select
                  className="input text-xs py-1.5 h-8"
                  value={db.metric ?? 'sessions'}
                  onChange={(e) => updateBinding({ metric: e.target.value })}
                >
                  <option value="sessions">Sessões</option>
                  <option value="conversions">Conversões</option>
                  <option value="cost">Custo Total Ads</option>
                  <option value="roas">ROAS Médio</option>
                </select>
              </div>
            ) : (
              <>
                <label className="btn-secondary text-xs h-8 py-0 w-full cursor-pointer flex items-center justify-center gap-1.5">
                  <Upload size={12} />
                  {customData.length > 0 ? `${customData.length} linhas importadas` : 'Importar CSV'}
                  <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                </label>
                {columns.length > 0 && (
                  <>
                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] block mb-1">Coluna do rótulo</label>
                      <select
                        className="input text-xs py-1.5 h-8"
                        value={db.xKey ?? columns[0]}
                        onChange={(e) => updateBinding({ xKey: e.target.value })}
                      >
                        {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] block mb-1">Coluna do valor</label>
                      <select
                        className="input text-xs py-1.5 h-8"
                        value={db.yKey ?? columns[1] ?? columns[0]}
                        onChange={(e) => updateBinding({ yKey: e.target.value })}
                      >
                        {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </>
            )}
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
                value={db.chartType ?? 'area'}
                onChange={(e) => updateBinding({ chartType: e.target.value as SlideDataBinding['chartType'] })}
              >
                {CHART_TYPE_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] block mb-1">Fonte de dados</label>
              <SourceToggle value={source} onChange={(s) => updateBinding({ source: s })} />
            </div>

            {source !== 'spreadsheet' ? (
              <div>
                <label className="text-[10px] text-[var(--text-muted)] block mb-1">Período</label>
                <select
                  className="input text-xs py-1.5 h-8"
                  value={db.dateRange ?? 'last_30d'}
                  onChange={(e) => updateBinding({ dateRange: e.target.value })}
                >
                  <option value="last_7d">Últimos 7 dias</option>
                  <option value="last_30d">Últimos 30 dias</option>
                  <option value="last_90d">Últimos 90 dias</option>
                </select>
              </div>
            ) : (
              <>
                <label className="btn-secondary text-xs h-8 py-0 w-full cursor-pointer flex items-center justify-center gap-1.5">
                  <Upload size={12} />
                  {customData.length > 0 ? `${customData.length} linhas importadas` : 'Importar CSV'}
                  <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                </label>
                {columns.length > 0 && (
                  <>
                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] block mb-1">
                        {db.chartType === 'pie' || db.chartType === 'donut' ? 'Coluna de rótulos' : 'Coluna X'}
                      </label>
                      <select
                        className="input text-xs py-1.5 h-8"
                        value={db.xKey ?? columns[0]}
                        onChange={(e) => updateBinding({ xKey: e.target.value })}
                      >
                        {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] block mb-1">
                        {db.chartType === 'pie' || db.chartType === 'donut' ? 'Coluna de valores' : 'Coluna Y'}
                      </label>
                      <select
                        className="input text-xs py-1.5 h-8"
                        value={db.yKey ?? columns[1] ?? columns[0]}
                        onChange={(e) => updateBinding({ yKey: e.target.value })}
                      >
                        {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </>
            )}
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
