import { z } from "zod"

// ─── Primitives ───────────────────────────────────────────────────
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens")

export const emailSchema = z.string().email("E-mail inválido").toLowerCase().trim()

export const urlSchema = z.string().url("URL inválida").optional()

// ─── Contact form ─────────────────────────────────────────────────
export const contactSchema = z.object({
  name:    z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  email:   emailSchema,
  subject: z.string().min(5, "Assunto muito curto").max(200),
  message: z.string().min(20, "Mensagem muito curta").max(2000),
})

export type ContactFormData = z.infer<typeof contactSchema>

// ─── Newsletter ───────────────────────────────────────────────────
export const newsletterSchema = z.object({
  email: emailSchema,
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>

// ─── Pagination ───────────────────────────────────────────────────
export const paginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})

export type PaginationParams = z.infer<typeof paginationSchema>

// ─── Server Action response ───────────────────────────────────────
export type ActionResult<T = void> =
  | { success: true;  data: T }
  | { success: false; error: string }
