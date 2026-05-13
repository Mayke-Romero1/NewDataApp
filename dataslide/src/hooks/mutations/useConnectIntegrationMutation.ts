import { useMutation } from '@tanstack/react-query'
import { getOAuthUrl } from '@/lib/api/integrations'
import type { IntegrationProvider } from '@/types'

export const useConnectIntegrationMutation = () =>
  useMutation({
    mutationFn: (provider: IntegrationProvider) => getOAuthUrl(provider),
    onSuccess: ({ url, state }) => {
      sessionStorage.setItem('oauth_state', state)
      window.location.href = url
    },
  })
