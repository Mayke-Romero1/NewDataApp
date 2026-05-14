import { useState } from 'react'
import {
  BarChart2, Search, ShoppingBag, Globe, Video, Briefcase,
  FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw,
  Loader2, Plus, XCircle, Plug,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { Integration, IntegrationProvider } from '@/types'
import { cn } from '@/lib/utils'
import { GoogleSheetConnectModal } from '@/components/shared/GoogleSheetConnectModal'
import { ExcelUploadModal } from '@/components/shared/ExcelUploadModal'
import { useConnectIntegrationMutation } from '@/hooks/mutations/useConnectIntegrationMutation'
import { useDisconnectIntegrationMutation } from '@/hooks/mutations/useDisconnectIntegrationMutation'
import { useSyncIntegrationMutation } from '@/hooks/mutations/useSyncIntegrationMutation'

interface SpreadsheetProviderDef {
  provider: IntegrationProvider
  label: string
  color: string
  description: string
}

interface MarketingProviderDef {
  provider: IntegrationProvider
  label: string
  color: string
  icon: React.ElementType
}

const SPREADSHEET_PROVIDERS: SpreadsheetProviderDef[] = [
  {
    provider: 'google_sheets',
    label: 'Google Sheets',
    color: '#0F9D58',
    description: 'Conecte uma planilha via URL e use os dados nos seus slides e dashboards.',
  },
  {
    provider: 'microsoft_excel',
    label: 'Microsoft Excel',
    color: '#217346',
    description: 'Importe dados fazendo upload de um arquivo .xlsx diretamente.',
  },
]

const MARKETING_PROVIDERS: MarketingProviderDef[] = [
  { provider: 'google_analytics', label: 'Google Analytics 4', color: '#f59e0b', icon: BarChart2 },
  { provider: 'google_ads', label: 'Google Ads', color: '#4f63f7', icon: ShoppingBag },
  { provider: 'meta_ads', label: 'Meta Ads', color: '#1877f2', icon: Globe },
  { provider: 'tiktok_ads', label: 'TikTok Ads', color: '#000000', icon: Video },
  { provider: 'linkedin_ads', label: 'LinkedIn Ads', color: '#0a66c2', icon: Briefcase },
  { provider: 'search_console', label: 'Search Console', color: '#22c55e', icon: Search },
]

const StatusBadge = ({ status }: { status: Integration['status'] }) => {
  if (status === 'connected') {
    return (
      <div className="flex items-center gap-1">
        <CheckCircle2 size={11} className="text-emerald-400" />
        <span className="text-[10px] text-emerald-400">Conectado</span>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-1">
        <AlertCircle size={11} className="text-red-400" />
        <span className="text-[10px] text-red-400">Erro</span>
      </div>
    )
  }
  if (status === 'syncing') {
    return (
      <div className="flex items-center gap-1">
        <Loader2 size={11} className="animate-spin text-[#748bff]" />
        <span className="text-[10px] text-[#748bff]">Sincronizando</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1">
      <XCircle size={11} className="text-[var(--text-muted)]" />
      <span className="text-[10px] text-[var(--text-muted)]">Desconectado</span>
    </div>
  )
}

interface ConnectedSpreadsheetRowProps {
  integration: Integration
}

const ConnectedSpreadsheetRow = ({ integration }: ConnectedSpreadsheetRowProps) => {
  const disconnect = useDisconnectIntegrationMutation()
  const sync = useSyncIntegrationMutation()
  const color = integration.provider === 'google_sheets' ? '#0F9D58' : '#217346'

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] hover:border-[rgba(79,99,247,0.3)] transition-colors">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <FileSpreadsheet size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[var(--text-primary)] truncate">{integration.name}</p>
        <StatusBadge status={integration.status} />
      </div>
      <button
        type="button"
        onClick={() => sync.mutate(integration.id)}
        disabled={sync.isPending || integration.status === 'syncing'}
        title="Sincronizar"
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[rgba(79,99,247,0.4)] hover:text-[#748bff] transition-colors disabled:opacity-50"
      >
        <RefreshCw size={12} className={cn(sync.isPending && 'animate-spin')} />
      </button>
      <button
        type="button"
        onClick={() => disconnect.mutate(integration.id)}
        disabled={disconnect.isPending}
        title="Remover"
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500/40 hover:text-red-400 transition-colors disabled:opacity-50"
      >
        <XCircle size={12} />
      </button>
    </div>
  )
}

export function IntegrationsPage() {
  const { integrations } = useAppStore()
  const [sheetsOpen, setSheetsOpen] = useState(false)
  const [excelOpen, setExcelOpen] = useState(false)

  const connectMutation = useConnectIntegrationMutation()
  const disconnectMutation = useDisconnectIntegrationMutation()

  const spreadsheetIntegrations = integrations.filter(
    (i) => i.provider === 'google_sheets' || i.provider === 'microsoft_excel'
  )

  const getMarketingIntegration = (provider: IntegrationProvider) =>
    integrations.find((i) => i.provider === provider)

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-2xl space-y-10">

        <div>
          <h1 className="font-display font-semibold text-base text-[var(--text-primary)] mb-1">Integrações</h1>
          <p className="text-sm text-[var(--text-muted)]">Conecte suas fontes de dados para usar métricas reais nos slides e dashboards.</p>
        </div>

        {/* Planilhas */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={15} className="text-[var(--text-secondary)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Planilhas</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {SPREADSHEET_PROVIDERS.map(({ provider, label, color, description }) => (
              <div key={provider} className="card space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <FileSpreadsheet size={18} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
                <button
                  type="button"
                  onClick={() => provider === 'google_sheets' ? setSheetsOpen(true) : setExcelOpen(true)}
                  className="btn-secondary text-xs h-8 py-0 w-full justify-center flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  {provider === 'google_sheets' ? 'Conectar planilha' : 'Importar arquivo'}
                </button>
              </div>
            ))}
          </div>

          {spreadsheetIntegrations.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Planilhas conectadas
              </p>
              {spreadsheetIntegrations.map((integration) => (
                <ConnectedSpreadsheetRow key={integration.id} integration={integration} />
              ))}
            </div>
          )}
        </section>

        {/* Integrações de Marketing */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Plug size={15} className="text-[var(--text-secondary)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Integrações de Marketing</h2>
          </div>

          <div className="space-y-2">
            {MARKETING_PROVIDERS.map(({ provider, label, color, icon: Icon }) => {
              const integration = getMarketingIntegration(provider)
              const isConnected = integration?.status === 'connected'

              return (
                <div
                  key={provider}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(79,99,247,0.3)] transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                    {integration ? (
                      <StatusBadge status={integration.status} />
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle size={11} className="text-[var(--text-muted)]" />
                        <span className="text-[10px] text-[var(--text-muted)]">Não conectado</span>
                      </div>
                    )}
                  </div>

                  {isConnected && integration ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Desconectar"
                        onClick={() => disconnectMutation.mutate(integration.id)}
                        disabled={disconnectMutation.isPending}
                        className="btn-secondary text-[10px] h-7 py-0 px-2.5 flex items-center gap-1"
                      >
                        {disconnectMutation.isPending
                          ? <Loader2 size={11} className="animate-spin" />
                          : <XCircle size={11} />}
                        Desconectar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => connectMutation.mutate(provider)}
                      disabled={connectMutation.isPending}
                      className="btn-primary text-[10px] h-7 py-0 px-3 flex items-center gap-1 flex-shrink-0"
                    >
                      {connectMutation.isPending
                        ? <Loader2 size={11} className="animate-spin" />
                        : <Plus size={11} />}
                      Conectar
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <GoogleSheetConnectModal open={sheetsOpen} onClose={() => setSheetsOpen(false)} />
      <ExcelUploadModal open={excelOpen} onClose={() => setExcelOpen(false)} />
    </div>
  )
}
