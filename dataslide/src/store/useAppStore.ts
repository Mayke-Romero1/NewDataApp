import { create } from 'zustand'
import type { Dashboard, Integration, SlidePresentation, Workspace } from '@/types'
import { MOCK_INTEGRATIONS, MOCK_DASHBOARDS, MOCK_PRESENTATIONS } from '@/lib/mockData'

interface AppState {
  // Workspace
  workspace: Workspace | null
  setWorkspace: (ws: Workspace) => void

  // Integrations
  integrations: Integration[]
  updateIntegrationStatus: (id: string, status: Integration['status']) => void

  // Dashboards
  dashboards: Dashboard[]
  activeDashboardId: string | null
  setActiveDashboard: (id: string) => void
  createDashboard: (name: string) => Dashboard
  deleteDashboard: (id: string) => void

  // Presentations
  presentations: SlidePresentation[]
  activePresentationId: string | null
  setActivePresentation: (id: string) => void
  createPresentation: (name: string) => SlidePresentation

  // UI State
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  activeApp: 'dashboard' | 'slides' | 'integrations' | 'settings'
  setActiveApp: (app: AppState['activeApp']) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  workspace: null,
  setWorkspace: (ws) => set({ workspace: ws }),

  integrations: MOCK_INTEGRATIONS,
  updateIntegrationStatus: (id, status) =>
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === id ? { ...i, status } : i
      ),
    })),

  dashboards: MOCK_DASHBOARDS,
  activeDashboardId: MOCK_DASHBOARDS[0]?.id ?? null,
  setActiveDashboard: (id) => set({ activeDashboardId: id }),
  createDashboard: (name) => {
    const newDashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name,
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
  createPresentation: (name) => {
    const newPres: SlidePresentation = {
      id: `pres-${Date.now()}`,
      name,
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
