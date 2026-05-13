import { apiFetch } from '@/lib/fetch'
import type { Integration, IntegrationProvider } from '@/types'

export interface OAuthUrlResponse {
  url: string
  state: string
}

export const fetchIntegrations = (): Promise<Integration[]> =>
  apiFetch<Integration[]>('/integrations')

export const getOAuthUrl = (provider: IntegrationProvider): Promise<OAuthUrlResponse> =>
  apiFetch<OAuthUrlResponse>(`/integrations/auth-url/${provider}`)

export const syncIntegration = (id: string): Promise<void> =>
  apiFetch<void>(`/integrations/${id}/sync`, { method: 'POST' })

export const disconnectIntegration = (id: string): Promise<void> =>
  apiFetch<void>(`/integrations/${id}`, { method: 'DELETE' })
