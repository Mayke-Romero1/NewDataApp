import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FileSpreadsheet, LayoutTemplate } from 'lucide-react'
import { GoogleSheetConnectModal } from '@/components/shared/GoogleSheetConnectModal'
import { ExcelUploadModal } from '@/components/shared/ExcelUploadModal'

interface NewSlideModalProps {
  open: boolean
  onClose: () => void
  onCreateSlide: () => void
}

type Step = 'choose' | 'google_sheets' | 'excel'

export const NewSlideModal = ({ open, onClose, onCreateSlide }: NewSlideModalProps) => {
  const [step, setStep] = useState<Step>('choose')

  const handleClose = () => {
    setStep('choose')
    onClose()
  }

  const handleBlank = () => {
    onCreateSlide()
    handleClose()
  }

  const handlePickGoogleSheets = () => {
    onCreateSlide()
    setStep('google_sheets')
  }

  const handlePickExcel = () => {
    onCreateSlide()
    setStep('excel')
  }

  const handleSubModalClose = () => {
    setStep('choose')
    onClose()
  }

  if (!open) return null

  if (step === 'google_sheets') {
    return (
      <GoogleSheetConnectModal
        open
        onClose={handleSubModalClose}
      />
    )
  }

  if (step === 'excel') {
    return (
      <ExcelUploadModal
        open
        onClose={handleSubModalClose}
      />
    )
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="card w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-base text-[var(--text-primary)]">
            Novo slide
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-glass)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)] mb-4">
          Escolha como deseja começar este slide.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleBlank}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(79,99,247,0.4)] hover:bg-[rgba(79,99,247,0.04)] transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0">
              <LayoutTemplate size={18} className="text-[var(--text-secondary)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Slide em branco</p>
              <p className="text-[10px] text-[var(--text-muted)]">Comece do zero sem dados vinculados</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handlePickGoogleSheets}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(15,157,88,0.5)] hover:bg-[rgba(15,157,88,0.04)] transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0F9D5818' }}>
              <FileSpreadsheet size={18} style={{ color: '#0F9D58' }} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Google Sheets</p>
              <p className="text-[10px] text-[var(--text-muted)]">Conecte uma planilha via URL</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handlePickExcel}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[rgba(33,115,70,0.5)] hover:bg-[rgba(33,115,70,0.04)] transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#21734618' }}>
              <FileSpreadsheet size={18} style={{ color: '#217346' }} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Microsoft Excel</p>
              <p className="text-[10px] text-[var(--text-muted)]">Importe um arquivo .xlsx</p>
            </div>
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
