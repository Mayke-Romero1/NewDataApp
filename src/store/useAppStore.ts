import { create } from 'zustand'
import type { Client, Dashboard, Slide, SlideElement, SlidePresentation, Workspace } from '@/types'
import { MOCK_DASHBOARDS, MOCK_PRESENTATIONS } from '@/lib/mockData'

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
  archiveClient: (id: string) => void

  // Dashboards
  dashboards: Dashboard[]
  activeDashboardId: string | null
  setActiveDashboard: (id: string) => void
  createDashboard: (name: string, clientId?: string) => Dashboard
  deleteDashboard: (id: string) => void
  archiveDashboard: (id: string) => void
  unarchiveDashboard: (id: string) => void
  duplicateDashboard: (id: string) => void

  // Presentations
  presentations: SlidePresentation[]
  activePresentationId: string | null
  setActivePresentation: (id: string) => void
  createPresentation: (name: string, clientId?: string) => SlidePresentation
  deletePresentation: (id: string) => void
  archivePresentation: (id: string) => void
  unarchivePresentation: (id: string) => void
  duplicatePresentation: (id: string) => void

  // Slide & Element editing
  addSlide: (presentationId: string, slide: Slide) => void
  updateSlide: (presentationId: string, slideId: string, patch: { background?: string; notes?: string }) => void
  addElement: (presentationId: string, slideId: string, element: SlideElement) => void
  updateElement: (presentationId: string, slideId: string, elementId: string, patch: Partial<SlideElement>) => void
  removeElement: (presentationId: string, slideId: string, elementId: string) => void
  reorderElement: (presentationId: string, slideId: string, elementId: string, direction: 'front' | 'back') => void

  // UI State
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  activeApp: 'dashboard' | 'slides' | 'settings' | 'clients'
  setActiveApp: (app: AppState['activeApp']) => void
}

export const useAppStore = create<AppState>((set) => ({
  workspace: null,
  setWorkspace: (ws) => set({ workspace: ws }),

  clients: [],
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
  archiveClient: (id) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, archived: true } : c)),
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
  archiveDashboard: (id) =>
    set((state) => ({
      dashboards: state.dashboards.map((d) => (d.id === id ? { ...d, archived: true } : d)),
    })),
  unarchiveDashboard: (id) =>
    set((state) => ({
      dashboards: state.dashboards.map((d) => (d.id === id ? { ...d, archived: false } : d)),
    })),
  duplicateDashboard: (id) =>
    set((state) => {
      const original = state.dashboards.find((d) => d.id === id)
      if (!original) return state
      const copy: Dashboard = {
        ...original,
        id: `dash-${Date.now()}`,
        name: `Cópia de ${original.name}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        archived: false,
      }
      return { dashboards: [...state.dashboards, copy] }
    }),

  presentations: MOCK_PRESENTATIONS,
  activePresentationId: MOCK_PRESENTATIONS[0]?.id ?? null,
  setActivePresentation: (id) => set({ activePresentationId: id }),
  createPresentation: (name, clientId) => {
    const defaultSlide: Slide = {
      id: `slide-${Date.now()}`,
      index: 0,
      background: '#0d0f1a',
      elements: [],
    }
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
      slides: [defaultSlide],
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

  deletePresentation: (id) =>
    set((state) => ({
      presentations: state.presentations.filter((p) => p.id !== id),
      activePresentationId:
        state.activePresentationId === id
          ? state.presentations[0]?.id ?? null
          : state.activePresentationId,
    })),
  archivePresentation: (id) =>
    set((state) => ({
      presentations: state.presentations.map((p) => (p.id === id ? { ...p, archived: true } : p)),
    })),
  unarchivePresentation: (id) =>
    set((state) => ({
      presentations: state.presentations.map((p) => (p.id === id ? { ...p, archived: false } : p)),
    })),
  duplicatePresentation: (id) =>
    set((state) => {
      const original = state.presentations.find((p) => p.id === id)
      if (!original) return state
      const copy: SlidePresentation = {
        ...original,
        id: `pres-${Date.now()}`,
        name: `Cópia de ${original.name}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        archived: false,
      }
      return { presentations: [...state.presentations, copy] }
    }),

  addSlide: (presentationId, slide) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id !== presentationId ? p : { ...p, updatedAt: new Date(), slides: [...p.slides, slide] }
      ),
    })),

  updateSlide: (presentationId, slideId, patch) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id !== presentationId ? p : {
          ...p,
          updatedAt: new Date(),
          slides: p.slides.map((s) => s.id !== slideId ? s : { ...s, ...patch }),
        }
      ),
    })),

  addElement: (presentationId, slideId, element) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id !== presentationId ? p : {
          ...p,
          updatedAt: new Date(),
          slides: p.slides.map((s) =>
            s.id !== slideId ? s : { ...s, elements: [...s.elements, element] }
          ),
        }
      ),
    })),

  updateElement: (presentationId, slideId, elementId, patch) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id !== presentationId ? p : {
          ...p,
          updatedAt: new Date(),
          slides: p.slides.map((s) =>
            s.id !== slideId ? s : {
              ...s,
              elements: s.elements.map((el) =>
                el.id !== elementId ? el : { ...el, ...patch }
              ),
            }
          ),
        }
      ),
    })),

  removeElement: (presentationId, slideId, elementId) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id !== presentationId ? p : {
          ...p,
          updatedAt: new Date(),
          slides: p.slides.map((s) =>
            s.id !== slideId ? s : {
              ...s,
              elements: s.elements.filter((el) => el.id !== elementId),
            }
          ),
        }
      ),
    })),

  reorderElement: (presentationId, slideId, elementId, direction) =>
    set((state) => ({
      presentations: state.presentations.map((p) =>
        p.id !== presentationId ? p : {
          ...p,
          slides: p.slides.map((s) => {
            if (s.id !== slideId) return s
            const zIndexes = s.elements.map((e) => e.zIndex)
            const maxZ = Math.max(...zIndexes)
            const minZ = Math.min(...zIndexes)
            return {
              ...s,
              elements: s.elements.map((el) =>
                el.id !== elementId ? el : {
                  ...el,
                  zIndex: direction === 'front' ? maxZ + 1 : minZ - 1,
                }
              ),
            }
          }),
        }
      ),
    })),

  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  activeApp: 'dashboard',
  setActiveApp: (app) => set({ activeApp: app }),
}))
