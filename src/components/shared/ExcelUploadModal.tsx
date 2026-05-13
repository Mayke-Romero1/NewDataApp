import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import { excelUploadSchema, type ExcelUploadFormData } from '@/schemas/spreadsheets'
import { useUploadExcelMutation } from '@/hooks/mutations/useUploadExcelMutation'

interface ExcelUploadModalProps {
  open: boolean
  onClose: () => void
}

export const ExcelUploadModal = ({ open, onClose }: ExcelUploadModalProps) => {
  const mutation = useUploadExcelMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ExcelUploadFormData>({
    resolver: zodResolver(excelUploadSchema),
  })

  const selectedFile = watch('file')
  const fileName = selectedFile?.[0]?.name

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  useEffect(() => {
    if (mutation.isSuccess) onClose()
  }, [mutation.isSuccess, onClose])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: ExcelUploadFormData) => {
    mutation.mutate({ name: data.name, file: data.file[0] })
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#21734626' }}>
              <FileSpreadsheet size={15} style={{ color: '#217346' }} />
            </div>
            <h2 className="font-display font-semibold text-base text-[var(--text-primary)]">
              Importar Excel
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
              placeholder="Ex: Base de Clientes Q1"
              className="input w-full"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Arquivo .xlsx
            </label>
            <label className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--border-active)] bg-[var(--bg-tertiary)] cursor-pointer transition-colors">
              <Upload size={18} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)] text-center px-4 truncate max-w-full">
                {fileName ?? 'Clique para selecionar ou arraste'}
              </span>
              <input
                {...register('file')}
                type="file"
                accept=".xlsx"
                className="hidden"
              />
            </label>
            {errors.file && (
              <p className="text-xs text-red-400 mt-1">{errors.file.message as string}</p>
            )}
          </div>

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
              Importar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
