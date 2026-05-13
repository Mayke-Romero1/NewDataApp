import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { IntegrationProvider } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
}

export function formatNumber(value: number, compact = false): string {
  if (compact && value >= 1000) {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export const PROVIDER_LABELS: Record<IntegrationProvider, string> = {
  google_analytics: 'Google Analytics 4',
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads',
  tiktok_ads: 'TikTok Ads',
  linkedin_ads: 'LinkedIn Ads',
  search_console: 'Search Console',
  google_sheets: 'Google Sheets',
}

export const PROVIDER_COLORS: Record<IntegrationProvider, string> = {
  google_analytics: '#E37400',
  google_ads: '#4285F4',
  meta_ads: '#0082FB',
  tiktok_ads: '#010101',
  linkedin_ads: '#0A66C2',
  search_console: '#34A853',
  google_sheets: '#0F9D58',
}

export const PROVIDER_ICONS: Record<IntegrationProvider, string> = {
  google_analytics: 'chart-bar',
  google_ads: 'ad',
  meta_ads: 'brand-facebook',
  tiktok_ads: 'brand-tiktok',
  linkedin_ads: 'brand-linkedin',
  search_console: 'search',
  google_sheets: 'table',
}
