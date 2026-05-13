const API_URL = (import.meta.env.VITE_API_URL as string) ?? ''

export interface ApiError extends Error {
  status: number
}

const createApiError = (status: number, message: string): ApiError => {
  const error = new Error(message) as ApiError
  error.status = status
  return error
}

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers ?? {}),
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }))
    throw createApiError(response.status, (body as { message?: string }).message ?? response.statusText)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
