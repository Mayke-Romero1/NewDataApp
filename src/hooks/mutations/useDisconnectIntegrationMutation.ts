import { useMutation, useQueryClient } from '@tanstack/react-query'
import { disconnectIntegration } from '@/lib/api/integrations'

export const useDisconnectIntegrationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => disconnectIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}
