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

// ─── Auth ────────────────────────────────────────────────────────
export const signInSchema = z.object({
  email:    emailSchema,
  password: z.string().min(6, "Senha muito curta"),
})

export type SignInInput = z.infer<typeof signInSchema>

// ─── Admin: Post ─────────────────────────────────────────────────
export const createPostSchema = z.object({
  title:          z.string().min(1, "Título obrigatório").max(255),
  slug:           slugSchema,
  description:    z.string().min(1, "Descrição obrigatória").max(500),
  content:        z.string().min(1, "Conteúdo obrigatório"),
  status:         z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishedAt:    z.string().optional(),
  featured:       z.boolean(),
  categoryId:     z.string().optional(),
  tags:           z.string().optional(),       // comma-separated
  coverImage:     z.string().optional(),
  seoTitle:       z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords:    z.string().optional(),       // comma-separated
})

export type CreatePostInput = z.infer<typeof createPostSchema>

// Update has the same shape plus id
export const updatePostSchema = createPostSchema.extend({
  id: z.string().cuid(),
})

export type UpdatePostInput = z.infer<typeof updatePostSchema>

// ─── Admin: Category ─────────────────────────────────────────────
export const createCategorySchema = z.object({
  slug:        slugSchema,
  name:        z.string().min(1).max(50),
  description: z.string().optional(),
  icon:        z.string().optional(),
  color:       z.string().optional(),
  type:        z.enum(["BLOG", "TOOL"]),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
