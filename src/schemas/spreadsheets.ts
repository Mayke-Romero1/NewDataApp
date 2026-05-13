import { z } from 'zod'

export const googleSheetConnectSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  spreadsheetUrl: z
    .string()
    .min(1, 'URL obrigatória')
    .refine(
      (url) => url.includes('docs.google.com/spreadsheets'),
      'Informe uma URL válida do Google Sheets'
    ),
})

export type GoogleSheetConnectFormData = z.infer<typeof googleSheetConnectSchema>

const isValidFileList = (val: unknown): val is FileList =>
  typeof FileList !== 'undefined' && val instanceof FileList

export const excelUploadSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  file: z
    .custom<FileList>(isValidFileList, 'Arquivo obrigatório')
    .refine((files) => files.length > 0, 'Arquivo obrigatório')
    .refine(
      (files) => files[0]?.name.toLowerCase().endsWith('.xlsx'),
      'Apenas arquivos .xlsx são aceitos'
    ),
})

export type ExcelUploadFormData = z.infer<typeof excelUploadSchema>
