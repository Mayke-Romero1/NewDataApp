import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { DashboardPage } from '@/pages/DashboardPage'
import { SlidesPage } from '@/pages/SlidesPage'
import { IntegrationsPage } from '@/pages/IntegrationsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useAppStore } from '@/store/useAppStore'

function AppContent() {
  const { activeApp } = useAppStore()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden animate-fade-in">
          {activeApp === 'dashboard' && <DashboardPage />}
          {activeApp === 'slides' && <SlidesPage />}
          {activeApp === 'integrations' && <IntegrationsPage />}
          {activeApp === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <AppContent />
}
