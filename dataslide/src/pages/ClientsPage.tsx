import { useState } from 'react'
import { Users, Plus, LayoutDashboard, Presentation, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const AVATAR_COLORS = ['#4f63f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function ClientsPage() {
  const { clients, createClient, setActiveClient, dashboards, presentations } = useAppStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

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
            {clients.length} cliente{clients.length !== 1 ? 's' : ''}
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

      {clients.length === 0 && !isCreating && (
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

      {clients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, index) => {
            const clientDashboards = dashboards.filter((d) => d.clientId === client.id)
            const clientPresentations = presentations.filter((p) => p.clientId === client.id)
            const initials = client.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <button
                key={client.id}
                onClick={() => setActiveClient(client.id)}
                className={cn(
                  'group text-left p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]',
                  'hover:border-[var(--border-active)] hover:bg-[var(--bg-tertiary)] transition-all duration-200'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                    style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] truncate">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <LayoutDashboard size={11} />
                        {clientDashboards.length} dashboard{clientDashboards.length !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Presentation size={11} />
                        {clientPresentations.length === 1 ? '1 apresentação' : `${clientPresentations.length} apresentações`}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors flex-shrink-0 mt-0.5"
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border)]">
                  Criado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
