import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncIntegration } from '@/lib/api/integrations'

export const useSyncIntegrationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => syncIntegration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}
