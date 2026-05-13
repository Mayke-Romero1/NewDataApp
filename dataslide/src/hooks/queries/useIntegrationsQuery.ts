import { useQuery } from '@tanstack/react-query'
import { fetchIntegrations } from '@/lib/api/integrations'

export const useIntegrationsQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['integrations'],
    queryFn: fetchIntegrations,
  })

  return {
    integrations: data ?? [],
    isLoading,
    isError,
  }
}
