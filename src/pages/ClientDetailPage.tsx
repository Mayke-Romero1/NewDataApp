import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Plus, LayoutDashboard, Presentation, MoreHorizontal, Archive, Trash2, Copy } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import type { Dashboard, SlidePresentation } from '@/types'

const AVATAR_COLORS = ['#4f63f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

type ItemAction = 'archive' | 'delete' | 'duplicate'

interface ItemMenuProps {
  onAction: (action: ItemAction) => void
  confirmLabel: string
}

const ItemMenu = ({ onAction, confirmLabel }: ItemMenuProps) => {
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const stop = (e: React.MouseEvent) => e.stopPropagation()

  const handleToggle = (e: React.MouseEvent) => {
    stop(e)
    setOpen((prev) => !prev)
    setConfirmDelete(false)
  }

  const handleAction = (e: React.MouseEvent, action: ItemAction) => {
    stop(e)
    if (action === 'delete') {
      setConfirmDelete(true)
      return
    }
    onAction(action)
    setOpen(false)
  }

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    stop(e)
    onAction('delete')
  }

  const handleDeleteCancel = (e: React.MouseEvent) => {
    stop(e)
    setConfirmDelete(false)
    setOpen(false)
  }

  return (
    <div ref={ref} onClick={stop}>
      <button
        onClick={handleToggle}
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
          'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]',
          open ? 'opacity-100 bg-[var(--bg-glass)]' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 min-w-[150px] rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg py-1">
          {confirmDelete ? (
            <div className="px-3 py-2">
              <p className="text-xs text-[var(--text-secondary)] mb-2">{confirmLabel}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 text-xs px-2 py-1 rounded-lg bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={(e) => handleAction(e, 'duplicate')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-colors"
              >
                <Copy size={13} />
                Copiar
              </button>
              <button
                onClick={(e) => handleAction(e, 'archive')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-colors"
              >
                <Archive size={13} />
                Arquivar
              </button>
              <button
                onClick={(e) => handleAction(e, 'delete')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} />
                Excluir
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

interface DashboardCardProps {
  dashboard: Dashboard
  onOpen: () => void
  onAction: (action: ItemAction) => void
}

const DashboardCard = ({ dashboard, onOpen, onAction }: DashboardCardProps) => (
  <div
    className={cn(
      'group relative text-left p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]',
      'hover:border-[var(--border-active)] hover:bg-[var(--bg-tertiary)] transition-all duration-200 cursor-pointer'
    )}
    onClick={onOpen}
  >
    <div className="flex items-center justify-between mb-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(79,99,247,0.1)' }}
      >
        <LayoutDashboard size={14} style={{ color: 'var(--brand)' }} />
      </div>
      <div className="relative">
        <ItemMenu onAction={onAction} confirmLabel="Excluir dashboard?" />
      </div>
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
  </div>
)

interface PresentationCardProps {
  presentation: SlidePresentation
  onOpen: () => void
  onAction: (action: ItemAction) => void
}

const PresentationCard = ({ presentation, onOpen, onAction }: PresentationCardProps) => (
  <div
    className={cn(
      'group relative text-left p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]',
      'hover:border-purple-400/50 hover:bg-[var(--bg-tertiary)] transition-all duration-200 cursor-pointer'
    )}
    onClick={onOpen}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10">
        <Presentation size={14} className="text-purple-500" />
      </div>
      <div className="relative">
        <ItemMenu onAction={onAction} confirmLabel="Excluir apresentação?" />
      </div>
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
  </div>
)

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
    deleteDashboard,
    archiveDashboard,
    duplicateDashboard,
    deletePresentation,
    archivePresentation,
    duplicatePresentation,
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

  const clientDashboards = dashboards.filter((d) => d.clientId === client.id && !d.archived)
  const clientPresentations = presentations.filter((p) => p.clientId === client.id && !p.archived)

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

  const handleDashboardAction = (id: string, action: ItemAction) => {
    if (action === 'delete') deleteDashboard(id)
    if (action === 'archive') archiveDashboard(id)
    if (action === 'duplicate') duplicateDashboard(id)
  }

  const handlePresentationAction = (id: string, action: ItemAction) => {
    if (action === 'delete') deletePresentation(id)
    if (action === 'archive') archivePresentation(id)
    if (action === 'duplicate') duplicatePresentation(id)
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
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
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                onOpen={() => handleOpenDashboard(dashboard.id)}
                onAction={(action) => handleDashboardAction(dashboard.id, action)}
              />
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
              <PresentationCard
                key={presentation.id}
                presentation={presentation}
                onOpen={() => handleOpenPresentation(presentation.id)}
                onAction={(action) => handlePresentationAction(presentation.id, action)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
