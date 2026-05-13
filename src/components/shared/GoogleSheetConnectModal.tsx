import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Link2, Loader2 } from 'lucide-react'
import { googleSheetConnectSchema, type GoogleSheetConnectFormData } from '@/schemas/spreadsheets'
import { useConnectGoogleSheetMutation } from '@/hooks/mutations/useConnectGoogleSheetMutation'

interface GoogleSheetConnectModalProps {
  open: boolean
  onClose: () => void
}

export const GoogleSheetConnectModal = ({ open, onClose }: GoogleSheetConnectModalProps) => {
  const mutation = useConnectGoogleSheetMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoogleSheetConnectFormData>({
    resolver: zodResolver(googleSheetConnectSchema),
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: GoogleSheetConnectFormData) => {
    mutation.mutate(data)
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="card w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0F9D5826' }}>
              <Link2 size={15} style={{ color: '#0F9D58' }} />
            </div>
            <h2 className="font-display font-semibold text-base text-[var(--text-primary)]">
              Conectar Google Sheets
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Nome da integração
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Ex: Relatório de Vendas"
              className="input w-full"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              URL da planilha
            </label>
            <input
              {...register('spreadsheetUrl')}
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="input w-full"
            />
            {errors.spreadsheetUrl && (
              <p className="text-xs text-red-400 mt-1">{errors.spreadsheetUrl.message}</p>
            )}
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Você será redirecionado para autenticar com o Google.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={mutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Conectar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
