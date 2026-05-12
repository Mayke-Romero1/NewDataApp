import { LayoutDashboard, Presentation, Plug, Settings, ChevronLeft, Plus, Zap } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'dashboard' as const, label: 'Dashboards', icon: LayoutDashboard },
  { id: 'slides' as const, label: 'Slides', icon: Presentation },
  { id: 'integrations' as const, label: 'Integrações', icon: Plug },
  { id: 'settings' as const, label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeApp, setActiveApp } = useAppStore()

  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r transition-all duration-300 flex-shrink-0',
        'bg-[var(--bg-secondary)] border-[var(--border)]',
        sidebarCollapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-display font-semibold text-[var(--text-primary)] text-sm">
            DataSlide
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveApp(id)}
            className={cn(
              'sidebar-item w-full text-left',
              activeApp === id && 'active',
              sidebarCollapsed && 'justify-center px-0'
            )}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-[var(--border)]">
        <button
          onClick={toggleSidebar}
          className={cn(
            'sidebar-item w-full',
            sidebarCollapsed && 'justify-center px-0'
          )}
        >
          <ChevronLeft
            size={18}
            className={cn('transition-transform flex-shrink-0', sidebarCollapsed && 'rotate-180')}
          />
          {!sidebarCollapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  )
}
