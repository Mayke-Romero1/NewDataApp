import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-clients'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { DashboardPage } from '@/pages/DashboardPage'
import { SlidesPage } from '@/pages/SlidesPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { ClientDetailPage } from '@/pages/ClientDetailPage'
import { IntegrationsPage } from '@/pages/IntegrationsPage'
import { useAppStore } from '@/store/useAppStore'

function AppContent() {
  const { activeApp, activeClientId } = useAppStore()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden animate-fade-in">
          {activeApp === 'clients' && activeClientId === null && <ClientsPage />}
          {activeApp === 'clients' && activeClientId !== null && <ClientDetailPage />}
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
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
