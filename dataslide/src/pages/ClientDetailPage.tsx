import { useState } from 'react'
import { ArrowLeft, Plus, LayoutDashboard, Presentation, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const AVATAR_COLORS = ['#4f63f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function ClientDetailPage() {
  const {
    activeClientId,
    clients,
    setActiveClient,
    dashboards,
    presentations,
    createDashboard,
    createPresentation,
    setActiveDashboard,
    setActivePresentation,
    setActiveApp,
  } = useAppStore()

  const [isCreatingDashboard, setIsCreatingDashboard] = useState(false)
  const [isCreatingPresentation, setIsCreatingPresentation] = useState(false)
  const [dashboardName, setDashboardName] = useState('')
  const [presentationName, setPresentationName] = useState('')

  const client = clients.find((c) => c.id === activeClientId)
  if (!client) return null

  const clientIndex = clients.indexOf(client)
  const initials = client.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  const avatarColor = AVATAR_COLORS[clientIndex % AVATAR_COLORS.length]

  const clientDashboards = dashboards.filter((d) => d.clientId === client.id)
  const clientPresentations = presentations.filter((p) => p.clientId === client.id)

  const handleCreateDashboard = () => {
    if (!dashboardName.trim()) return
    createDashboard(dashboardName.trim(), client.id)
    setDashboardName('')
    setIsCreatingDashboard(false)
  }

  const handleCreatePresentation = () => {
    if (!presentationName.trim()) return
    createPresentation(presentationName.trim(), client.id)
    setPresentationName('')
    setIsCreatingPresentation(false)
  }

  const handleOpenDashboard = (id: string) => {
    setActiveDashboard(id)
    setActiveApp('dashboard')
  }

  const handleOpenPresentation = (id: string) => {
    setActivePresentation(id)
    setActiveApp('slides')
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveClient(null)}
          className="w-9 h-9 rounded-[0.625rem] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-glass)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex-shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>
        <div>
          <h1 className="font-display font-semibold text-xl text-[var(--text-primary)]">{client.name}</h1>
          <p className="text-xs text-[var(--text-muted)]">
            {clientDashboards.length} dashboard{clientDashboards.length !== 1 ? 's' : ''} ·{' '}
            {clientPresentations.length === 1 ? '1 apresentação' : `${clientPresentations.length} apresentações`}
          </p>
        </div>
      </div>

      {/* Dashboards Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base text-[var(--text-primary)] flex items-center gap-2">
            <LayoutDashboard size={17} style={{ color: 'var(--brand)' }} />
            Dashboards
          </h2>
          <button onClick={() => setIsCreatingDashboard(true)} className="btn-secondary">
            <Plus size={14} />
            Novo Dashboard
          </button>
        </div>

        {isCreatingDashboard && (
          <div className="card mb-4">
            <div className="flex gap-2">
              <input
                autoFocus
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateDashboard()
                  if (e.key === 'Escape') { setIsCreatingDashboard(false); setDashboardName('') }
                }}
                placeholder="Nome do dashboard..."
                className="input"
              />
              <button onClick={handleCreateDashboard} className="btn-primary">Criar</button>
              <button
                onClick={() => { setIsCreatingDashboard(false); setDashboardName('') }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {clientDashboards.length === 0 && !isCreatingDashboard ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-[var(--border)] text-center">
            <LayoutDashboard size={22} className="text-[var(--text-muted)] mb-2" />
            <p className="text-sm text-[var(--text-muted)]">Nenhum dashboard criado para este cliente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientDashboards.map((dashboard) => (
              <button
                key={dashboard.id}
                onClick={() => handleOpenDashboard(dashboard.id)}
                className={cn(
                  'group text-left p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]',
                  'hover:border-[var(--border-active)] hover:bg-[var(--bg-tertiary)] transition-all duration-200'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(79,99,247,0.1)' }}
                  >
                    <LayoutDashboard size={14} style={{ color: 'var(--brand)' }} />
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors"
                  />
                </div>
                <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                  {dashboard.name}
                </h3>
                {dashboard.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{dashboard.description}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Atualizado {new Date(dashboard.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Presentations Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base text-[var(--text-primary)] flex items-center gap-2">
            <Presentation size={17} className="text-purple-500" />
            Apresentações
          </h2>
          <button onClick={() => setIsCreatingPresentation(true)} className="btn-secondary">
            <Plus size={14} />
            Nova Apresentação
          </button>
        </div>

        {isCreatingPresentation && (
          <div className="card mb-4">
            <div className="flex gap-2">
              <input
                autoFocus
                value={presentationName}
                onChange={(e) => setPresentationName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreatePresentation()
                  if (e.key === 'Escape') { setIsCreatingPresentation(false); setPresentationName('') }
                }}
                placeholder="Nome da apresentação..."
                className="input"
              />
              <button onClick={handleCreatePresentation} className="btn-primary">Criar</button>
              <button
                onClick={() => { setIsCreatingPresentation(false); setPresentationName('') }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {clientPresentations.length === 0 && !isCreatingPresentation ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-[var(--border)] text-center">
            <Presentation size={22} className="text-[var(--text-muted)] mb-2" />
            <p className="text-sm text-[var(--text-muted)]">Nenhuma apresentação criada para este cliente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientPresentations.map((presentation) => (
              <button
                key={presentation.id}
                onClick={() => handleOpenPresentation(presentation.id)}
                className={cn(
                  'group text-left p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]',
                  'hover:border-purple-400/50 hover:bg-[var(--bg-tertiary)] transition-all duration-200'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10">
                    <Presentation size={14} className="text-purple-500" />
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-[var(--text-muted)] group-hover:text-purple-500 transition-colors"
                  />
                </div>
                <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                  {presentation.name}
                </h3>
                {presentation.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{presentation.description}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Atualizado {new Date(presentation.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
