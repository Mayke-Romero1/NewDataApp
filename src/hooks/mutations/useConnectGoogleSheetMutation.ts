import { useMutation } from '@tanstack/react-query'
import { connectGoogleSheet } from '@/lib/api/integrations'

interface ConnectGoogleSheetVariables {
  name: string
  spreadsheetUrl: string
}

export const useConnectGoogleSheetMutation = () =>
  useMutation({
    mutationFn: ({ name, spreadsheetUrl }: ConnectGoogleSheetVariables) =>
      connectGoogleSheet(name, spreadsheetUrl),
    onSuccess: ({ url, state }) => {
      sessionStorage.setItem('oauth_state', state)
      window.location.href = url
    },
  })
