import { X, CheckCircle2, Circle, BarChart2, Search, ShoppingBag, Globe, Video, Briefcase, FileSpreadsheet } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { IntegrationProvider } from '@/types'
import { cn } from '@/lib/utils'

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
  google_sheets: { label: 'Google Sheets', icon: FileSpreadsheet, color: '#22c55e' },
  microsoft_excel: { label: 'Microsoft Excel', icon: FileSpreadsheet, color: '#217346' },
}

export const IntegrationPromptModal = ({ activePresentationId, onClose }: IntegrationPromptModalProps) => {
  const {
    integrations,
    setSlidesActiveIntegrationId,
    setSlidesIntegrationDismissed,
    setSlidesIntegrationModalSeen,
  } = useAppStore()

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

        <div className="space-y-2 max-h-72 overflow-y-auto mb-5 pr-0.5">
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
                return (
                  <div
                    key={integration.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] opacity-50"
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
                  </div>
                )
              })}
            </>
          )}

          {integrations.length === 0 && (
            <p className="text-center text-xs text-[var(--text-muted)] py-6">
              Nenhuma integração configurada.
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
  )
}
