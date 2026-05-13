import { create } from 'zustand'
import type { Client, Dashboard, SlidePresentation, Workspace } from '@/types'
import { MOCK_CLIENTS, MOCK_DASHBOARDS, MOCK_PRESENTATIONS } from '@/lib/mockData'

interface AppState {
  // Workspace
  workspace: Workspace | null
  setWorkspace: (ws: Workspace) => void

  // Clients
  clients: Client[]
  activeClientId: string | null
  setActiveClient: (id: string | null) => void
  createClient: (name: string) => Client
  deleteClient: (id: string) => void

  // Dashboards
  dashboards: Dashboard[]
  activeDashboardId: string | null
  setActiveDashboard: (id: string) => void
  createDashboard: (name: string, clientId?: string) => Dashboard
  deleteDashboard: (id: string) => void

  // Presentations
  presentations: SlidePresentation[]
  activePresentationId: string | null
  setActivePresentation: (id: string) => void
  createPresentation: (name: string, clientId?: string) => SlidePresentation

  // UI State
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  activeApp: 'dashboard' | 'slides' | 'integrations' | 'settings' | 'clients'
  setActiveApp: (app: AppState['activeApp']) => void
}

export const useAppStore = create<AppState>((set) => ({
  workspace: null,
  setWorkspace: (ws) => set({ workspace: ws }),

  clients: MOCK_CLIENTS,
  activeClientId: null,
  setActiveClient: (id) => set({ activeClientId: id }),
  createClient: (name) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({ clients: [...state.clients, newClient] }))
    return newClient
  },
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
      activeClientId: state.activeClientId === id ? null : state.activeClientId,
    })),

  dashboards: MOCK_DASHBOARDS,
  activeDashboardId: MOCK_DASHBOARDS[0]?.id ?? null,
  setActiveDashboard: (id) => set({ activeDashboardId: id }),
  createDashboard: (name, clientId) => {
    const newDashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name,
      clientId,
      widgets: [],
      integrations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      tags: [],
    }
    set((state) => ({
      dashboards: [...state.dashboards, newDashboard],
      activeDashboardId: newDashboard.id,
    }))
    return newDashboard
  },
  deleteDashboard: (id) =>
    set((state) => ({
      dashboards: state.dashboards.filter((d) => d.id !== id),
      activeDashboardId:
        state.activeDashboardId === id
          ? state.dashboards[0]?.id ?? null
          : state.activeDashboardId,
    })),

  presentations: MOCK_PRESENTATIONS,
  activePresentationId: MOCK_PRESENTATIONS[0]?.id ?? null,
  setActivePresentation: (id) => set({ activePresentationId: id }),
  createPresentation: (name, clientId) => {
    const newPres: SlidePresentation = {
      id: `pres-${Date.now()}`,
      name,
      clientId,
      theme: {
        primary: '#4f63f7',
        secondary: '#748bff',
        background: '#0d0f1a',
        text: '#f0f2ff',
        accent: '#22c55e',
        fontDisplay: 'Sora',
        fontBody: 'DM Sans',
      },
      slides: [],
      integrations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    }
    set((state) => ({
      presentations: [...state.presentations, newPres],
      activePresentationId: newPres.id,
    }))
    return newPres
  },

  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  activeApp: 'dashboard',
  setActiveApp: (app) => set({ activeApp: app }),
}))
