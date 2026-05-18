import { useState } from 'react'
import { X, CheckCircle2, Circle, BarChart2, Search, ShoppingBag, Globe, Video, Briefcase, FileSpreadsheet, Plus, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { IntegrationProvider } from '@/types'
import { cn } from '@/lib/utils'
import { GoogleSheetConnectModal } from '@/components/shared/GoogleSheetConnectModal'
import { ExcelUploadModal } from '@/components/shared/ExcelUploadModal'
import { useConnectIntegrationMutation } from '@/hooks/mutations/useConnectIntegrationMutation'

interface IntegrationPromptModalProps {
  activePresentationId: string
  onClose: () => void
}

const PROVIDER_META: Record<IntegrationProvider, { label: string; icon: React.ElementType; color: string }> = {
  google_analytics: { label: 'Google Analytics 4', icon: BarChart2, color: '#f59e0b' },
  google_ads: { label: 'Google Ads', icon: ShoppingBag, color: '#4f63f7' },
  meta_ads: { label: 'Meta Ads', icon: Globe, color: '#1877f2' },
  tiktok_ads: { label: 'TikTok Ads', icon: Video, color: '#000000' },
  linkedin_ads: { label: 'LinkedIn Ads', icon: Briefcase, color: '#0a66c2' },
  search_console: { label: 'Search Console', icon: Search, color: '#22c55e' },
  google_sheets: { label: 'Google Sheets', icon: FileSpreadsheet, color: '#0F9D58' },
  microsoft_excel: { label: 'Microsoft Excel', icon: FileSpreadsheet, color: '#217346' },
}

export const IntegrationPromptModal = ({ activePresentationId, onClose }: IntegrationPromptModalProps) => {
  const {
    integrations,
    setSlidesActiveIntegrationId,
    setSlidesIntegrationDismissed,
    setSlidesIntegrationModalSeen,
  } = useAppStore()

  const [sheetsOpen, setSheetsOpen] = useState(false)
  const [excelOpen, setExcelOpen] = useState(false)
  const connectMutation = useConnectIntegrationMutation()

  const handleSelectIntegration = (integrationId: string) => {
    setSlidesActiveIntegrationId(integrationId)
    setSlidesIntegrationDismissed(false)
    setSlidesIntegrationModalSeen(activePresentationId)
    onClose()
  }

  const handleDismiss = () => {
    setSlidesIntegrationDismissed(true)
    setSlidesIntegrationModalSeen(activePresentationId)
    onClose()
  }

  const connected = integrations.filter((i) => i.status === 'connected')
  const disconnected = integrations.filter((i) => i.status !== 'connected')

  return (
    <>
      <div
        className="fixed inset-0 z-[9000] flex items-center justify-center"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(13,15,26,0.75)' }}
      >
        <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl p-6">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={15} />
          </button>

          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">
            Conectar dados ao vivo
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-5 leading-relaxed">
            Conecte uma integração para usar métricas reais nos seus slides
          </p>

          <div className="space-y-2 max-h-80 overflow-y-auto mb-5 pr-0.5">
            {connected.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Disponíveis
                </p>
                {connected.map((integration) => {
                  const meta = PROVIDER_META[integration.provider]
                  const Icon = meta.icon
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(79,99,247,0.4)] hover:bg-[rgba(79,99,247,0.04)] transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${meta.color}18` }}
                      >
                        <Icon size={16} style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)]">{integration.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <CheckCircle2 size={10} className="text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Conectado</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectIntegration(integration.id)}
                        className="btn-primary text-[10px] h-7 py-0 px-3 flex-shrink-0"
                      >
                        Usar
                      </button>
                    </div>
                  )
                })}
              </>
            )}

            {disconnected.length > 0 && (
              <>
                <p className={cn('text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2', connected.length > 0 && 'mt-3')}>
                  Outras integrações
                </p>
                {disconnected.map((integration) => {
                  const meta = PROVIDER_META[integration.provider]
                  const Icon = meta.icon
                  const isSpreadsheet = integration.provider === 'google_sheets' || integration.provider === 'microsoft_excel'
                  const isConnecting = connectMutation.isPending && connectMutation.variables === integration.provider
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(79,99,247,0.3)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[var(--text-muted)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)]">{integration.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Circle size={10} className="text-[var(--text-muted)]" />
                          <span className="text-[10px] text-[var(--text-muted)]">Desconectado</span>
                        </div>
                      </div>
                      {!isSpreadsheet && (
                        <button
                          type="button"
                          onClick={() => connectMutation.mutate(integration.provider)}
                          disabled={connectMutation.isPending}
                          className="btn-primary text-[10px] h-7 py-0 px-3 flex-shrink-0 flex items-center gap-1"
                        >
                          {isConnecting ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                          Conectar
                        </button>
                      )}
                    </div>
                  )
                })}
              </>
            )}

            <p className={cn('text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2', integrations.length > 0 && 'mt-3')}>
              Planilhas
            </p>

            <div
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(15,157,88,0.4)] hover:bg-[rgba(15,157,88,0.04)] transition-colors cursor-pointer"
              onClick={() => setSheetsOpen(true)}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#0F9D5818' }}>
                <FileSpreadsheet size={16} style={{ color: '#0F9D58' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)]">Google Sheets</p>
                <p className="text-[10px] text-[var(--text-muted)]">Conectar via URL</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSheetsOpen(true) }}
                className="btn-secondary text-[10px] h-7 py-0 px-2.5 flex-shrink-0 flex items-center gap-1"
              >
                <Plus size={11} />
                Conectar
              </button>
            </div>

            <div
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(33,115,70,0.4)] hover:bg-[rgba(33,115,70,0.04)] transition-colors cursor-pointer"
              onClick={() => setExcelOpen(true)}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#21734618' }}>
                <FileSpreadsheet size={16} style={{ color: '#217346' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)]">Microsoft Excel</p>
                <p className="text-[10px] text-[var(--text-muted)]">Importar arquivo .xlsx</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setExcelOpen(true) }}
                className="btn-secondary text-[10px] h-7 py-0 px-2.5 flex-shrink-0 flex items-center gap-1"
              >
                <Plus size={11} />
                Importar
              </button>
            </div>

            {integrations.length === 0 && (
              <p className="text-center text-xs text-[var(--text-muted)] py-2">
                Nenhuma integração configurada ainda.
              </p>
            )}
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full btn-secondary text-xs h-9 py-0"
            >
              Continuar sem integração
            </button>
          </div>
        </div>
      </div>

      <GoogleSheetConnectModal open={sheetsOpen} onClose={() => setSheetsOpen(false)} />
      <ExcelUploadModal open={excelOpen} onClose={() => setExcelOpen(false)} />
    </>
  )
}
