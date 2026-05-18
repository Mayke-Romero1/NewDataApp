import { useEffect } from 'react'
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
import type { Integration } from '@/types'

function AppContent() {
  const { activeApp, activeClientId, updateIntegrationStatus } = useAppStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const integration = params.get('integration')
    const status = params.get('status')
    const token = params.get('token')
    const reason = params.get('reason')

    if (!integration || !status) return

    if (status === 'success' && token) {
      localStorage.setItem(`oauth_token_${integration}`, token)
      updateIntegrationStatus(integration, 'connected' as Integration['status'])
    } else if (status === 'error') {
      const msg = reason === 'invalid_state'
        ? 'Falha de segurança OAuth (state inválido). Tente novamente.'
        : `Erro ao conectar ${integration}. Tente novamente.`
      alert(msg)
    }

    window.history.replaceState({}, '', window.location.pathname)
  }, [])

  if (activeApp === 'slides') {
    return <SlidesPage />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden animate-fade-in">
          {activeApp === 'clients' && activeClientId === null && <ClientsPage />}
          {activeApp === 'clients' && activeClientId !== null && <ClientDetailPage />}
          {activeApp === 'dashboard' && <DashboardPage />}
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
