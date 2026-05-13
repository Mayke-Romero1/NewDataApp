import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadExcelFile } from '@/lib/api/integrations'

interface UploadExcelVariables {
  name: string
  file: File
}

export const useUploadExcelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, file }: UploadExcelVariables) => uploadExcelFile(name, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
}
