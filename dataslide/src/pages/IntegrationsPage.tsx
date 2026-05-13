import {
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Plus, ExternalLink, Loader2, LogOut
} from 'lucide-react'
import { useIntegrationsQuery } from '@/hooks/queries/useIntegrationsQuery'
import { useConnectIntegrationMutation } from '@/hooks/mutations/useConnectIntegrationMutation'
import { useSyncIntegrationMutation } from '@/hooks/mutations/useSyncIntegrationMutation'
import { useDisconnectIntegrationMutation } from '@/hooks/mutations/useDisconnectIntegrationMutation'
import { cn, PROVIDER_LABELS, PROVIDER_COLORS, formatRelativeTime } from '@/lib/utils'
import type { Integration, IntegrationProvider } from '@/types'

const PROVIDER_ORDER: IntegrationProvider[] = [
  'google_analytics',
  'google_ads',
  'meta_ads',
  'tiktok_ads',
  'linkedin_ads',
  'search_console',
  'google_sheets',
]

const PROVIDER_DESCRIPTIONS: Record<IntegrationProvider, string> = {
  google_analytics: 'Sessões, usuários, eventos, conversões e funis',
  google_ads: 'Campanhas, grupos de anúncios, palavras-chave e ROAS',
  meta_ads: 'Campanhas, adsets, criativos, alcance e frequência',
  tiktok_ads: 'Campanhas, vídeos, visualizações e engajamento',
  linkedin_ads: 'Campanhas B2B, leads, impressões e cliques',
  search_console: 'Queries, posições, CTR e impressões orgânicas',
  google_sheets: 'Importar dados de planilhas como fonte de dados',
}

function StatusBadge({ status }: { status: Integration['status'] }) {
  const configs = {
    connected: { icon: CheckCircle2, label: 'Conectado', cls: 'badge-success' },
    disconnected: { icon: XCircle, label: 'Desconectado', cls: '' },
    error: { icon: AlertCircle, label: 'Erro', cls: '' },
    syncing: { icon: Loader2, label: 'Sincronizando', cls: 'badge-brand' },
  }
  const { icon: Icon, label, cls } = configs[status]
  return (
    <span
      className={cn(
        'badge text-xs',
        cls,
        status === 'disconnected' && 'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border)]',
        status === 'error' && 'bg-red-500/10 text-red-400 border border-red-500/20'
      )}
    >
      <Icon size={11} className={status === 'syncing' ? 'animate-spin' : ''} />
      {label}
    </span>
  )
}

function ProviderLogo({ provider }: { provider: IntegrationProvider }) {
  const color = PROVIDER_COLORS[provider]
  const initials = PROVIDER_LABELS[provider].split(' ').map((w) => w[0]).join('').slice(0, 2)
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
      style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
    >
      {initials}
    </div>
  )
}

export function IntegrationsPage() {
  const { integrations, isLoading, isError } = useIntegrationsQuery()
  const connectMutation = useConnectIntegrationMutation()
  const syncMutation = useSyncIntegrationMutation()
  const disconnectMutation = useDisconnectIntegrationMutation()

  const connectedCount = integrations.filter((i) => i.status === 'connected').length

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[var(--text-muted)]" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-400">Erro ao carregar integrações. Verifique a conexão com o servidor.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-semibold text-lg text-[var(--text-primary)]">
            Integrações
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {connectedCount} de {integrations.length} plataformas conectadas
          </p>
        </div>
        <button className="btn-primary text-sm">
          <Plus size={15} /> Adicionar integração
        </button>
      </div>

      {/* Status bar */}
      <div className="card mb-6">
        <div className="flex items-center gap-6">
          {[
            { label: 'Conectadas', value: integrations.filter((i) => i.status === 'connected').length, color: '#22c55e' },
            { label: 'Com erro', value: integrations.filter((i) => i.status === 'error').length, color: '#ef4444' },
            { label: 'Desconectadas', value: integrations.filter((i) => i.status === 'disconnected').length, color: '#525878' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
              <span className="font-display font-semibold text-[var(--text-primary)]">{s.value}</span>
            </div>
          ))}
          <div className="flex-1" />
          {integrations.length > 0 && (
            <div
              className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden"
              style={{ width: 200 }}
            >
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${(connectedCount / integrations.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Integration cards */}
      <div className="space-y-3">
        {PROVIDER_ORDER.map((provider) => {
          const integration = integrations.find((i) => i.provider === provider)
          if (!integration) return null

          const isSyncing = syncMutation.isPending && syncMutation.variables === integration.id
          const isDisconnecting = disconnectMutation.isPending && disconnectMutation.variables === integration.id
          const isConnecting = connectMutation.isPending && connectMutation.variables === provider

          return (
            <div
              key={provider}
              className={cn(
                'card flex items-center gap-4 transition-all',
                integration.status === 'connected' && 'hover:border-[rgba(34,197,94,0.2)]',
                integration.status === 'error' && 'border-red-500/20'
              )}
            >
              <ProviderLogo provider={provider} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm text-[var(--text-primary)]">
                    {PROVIDER_LABELS[provider]}
                  </span>
                  <StatusBadge status={integration.status} />
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  {PROVIDER_DESCRIPTIONS[provider]}
                </p>
                {integration.accountName && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Conta: {integration.accountName}
                  </p>
                )}
                {integration.lastSync && integration.status === 'connected' && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Última sincronização: {formatRelativeTime(integration.lastSync)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {integration.status === 'connected' && (
                  <>
                    <button
                      className="btn-secondary text-xs h-8 py-0"
                      onClick={() => syncMutation.mutate(integration.id)}
                      disabled={isSyncing}
                    >
                      <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                      Sincronizar
                    </button>
                    <button
                      className="text-xs h-8 py-0 px-3 rounded-lg bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors flex items-center gap-1.5"
                      onClick={() => disconnectMutation.mutate(integration.id)}
                      disabled={isDisconnecting}
                    >
                      {isDisconnecting
                        ? <Loader2 size={13} className="animate-spin" />
                        : <LogOut size={13} />
                      }
                      Desconectar
                    </button>
                  </>
                )}
                {integration.status === 'error' && (
                  <button
                    className="text-xs h-8 py-0 px-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                    onClick={() => connectMutation.mutate(provider)}
                    disabled={isConnecting}
                  >
                    {isConnecting
                      ? <Loader2 size={13} className="animate-spin" />
                      : <RefreshCw size={13} />
                    }
                    Reconectar
                  </button>
                )}
                {integration.status === 'disconnected' && (
                  <button
                    className="btn-primary text-xs h-8 py-0"
                    onClick={() => connectMutation.mutate(provider)}
                    disabled={isConnecting}
                  >
                    {isConnecting
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Plus size={13} />
                    }
                    Conectar
                  </button>
                )}
                {integration.status === 'syncing' && (
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin" />
                    Sincronizando...
                  </span>
                )}
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
