import { Bell, Search, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const APP_TITLES = {
  dashboard: 'Dashboards',
  slides: 'Editor de Slides',
  integrations: 'Integrações',
  settings: 'Configurações',
}

export function Header() {
  const { activeApp } = useAppStore()

  return (
    <header className="h-14 border-b border-[var(--border)] flex items-center px-5 gap-4 bg-[var(--bg-secondary)] flex-shrink-0">
      {/* Page title */}
      <h1 className="font-display font-semibold text-[var(--text-primary)] text-base flex-1">
        {APP_TITLES[activeApp]}
      </h1>

      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type="text"
          placeholder="Buscar..."
          className="input pl-9 py-1.5 h-8 w-52 text-sm"
        />
      </div>

      {/* Notifications */}
      <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
      </button>

      {/* Workspace selector */}
      <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--border-active)] hover:bg-[var(--bg-glass)] transition-all text-sm">
        <div className="w-5 h-5 rounded-md bg-brand-700 flex items-center justify-center text-[10px] font-bold text-white">
          W
        </div>
        <span className="text-[var(--text-secondary)] text-xs font-medium">Workspace</span>
        <ChevronDown size={13} className="text-[var(--text-muted)]" />
      </button>
    </header>
  )
}
