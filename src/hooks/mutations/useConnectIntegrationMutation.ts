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
    onError: () => {
      alert('Não foi possível conectar. Verifique se o backend está rodando em http://localhost:3000')
    },
  })
