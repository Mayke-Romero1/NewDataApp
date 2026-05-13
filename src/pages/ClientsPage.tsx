import { useState, useRef, useEffect } from 'react'
import { Users, Plus, LayoutDashboard, Presentation, MoreHorizontal, Archive, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import type { Client } from '@/types'

const AVATAR_COLORS = ['#4f63f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

interface ClientCardProps {
  client: Client
  index: number
  dashboardCount: number
  presentationCount: number
  onOpen: () => void
  onArchive: () => void
  onDelete: () => void
}

const ClientCard = ({ client, index, dashboardCount, presentationCount, onOpen, onArchive, onDelete }: ClientCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initials = client.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen((prev) => !prev)
    setConfirmDelete(false)
  }

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    onArchive()
    setMenuOpen(false)
  }

  const handleDeleteRequest = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDelete(true)
  }

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDelete(false)
    setMenuOpen(false)
  }

  return (
    <div
      className={cn(
        'group relative text-left p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]',
        'hover:border-[var(--border-active)] hover:bg-[var(--bg-tertiary)] transition-all duration-200 cursor-pointer'
      )}
      onClick={onOpen}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
          style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] truncate pr-6">
            {client.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <LayoutDashboard size={11} />
              {dashboardCount} dashboard{dashboardCount !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Presentation size={11} />
              {presentationCount === 1 ? '1 apresentação' : `${presentationCount} apresentações`}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border)]">
        Criado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
      </p>

      <div ref={menuRef} className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleMenuToggle}
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
            'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]',
            menuOpen ? 'opacity-100 bg-[var(--bg-glass)]' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <MoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-8 z-50 min-w-[150px] rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg py-1">
            {confirmDelete ? (
              <div className="px-3 py-2">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Excluir cliente?</p>
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
                  onClick={handleArchive}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-colors"
                >
                  <Archive size={13} />
                  Arquivar
                </button>
                <button
                  onClick={handleDeleteRequest}
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
    </div>
  )
}

export function ClientsPage() {
  const { clients, createClient, setActiveClient, dashboards, presentations, archiveClient, deleteClient } = useAppStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const activeClients = clients.filter((c) => !c.archived)

  const handleCreate = () => {
    if (!newName.trim()) return
    createClient(newName.trim())
    setNewName('')
    setIsCreating(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') {
      setIsCreating(false)
      setNewName('')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-2xl text-[var(--text-primary)]">Clientes</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {activeClients.length} cliente{activeClients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn-primary">
          <Plus size={15} />
          Novo Cliente
        </button>
      </div>

      {isCreating && (
        <div className="card mb-6">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Nome do novo cliente</p>
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Coca-Cola, Nike..."
              className="input"
            />
            <button onClick={handleCreate} className="btn-primary">Criar</button>
            <button
              onClick={() => { setIsCreating(false); setNewName('') }}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {activeClients.length === 0 && !isCreating && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-4">
            <Users size={28} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="font-display font-semibold text-base text-[var(--text-primary)] mb-2">
            Nenhum cliente ainda
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs">
            Crie seu primeiro cliente para organizar dashboards e apresentações por conta.
          </p>
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            <Plus size={15} />
            Novo Cliente
          </button>
        </div>
      )}

      {activeClients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeClients.map((client, index) => {
            const clientDashboards = dashboards.filter((d) => d.clientId === client.id && !d.archived)
            const clientPresentations = presentations.filter((p) => p.clientId === client.id && !p.archived)
            return (
              <ClientCard
                key={client.id}
                client={client}
                index={index}
                dashboardCount={clientDashboards.length}
                presentationCount={clientPresentations.length}
                onOpen={() => setActiveClient(client.id)}
                onArchive={() => archiveClient(client.id)}
                onDelete={() => deleteClient(client.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
