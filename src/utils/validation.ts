import { z } from 'zod'

export const articleFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.number().min(1, 'Category is required'),
  tagIds: z.array(z.number()).min(1, 'At least one tag is required'),
})

export type ArticleFormData = z.infer<typeof articleFormSchema>

export const validateArticleForm = (data: unknown) => {
  try {
    return { success: true, data: articleFormSchema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      }
    }
    throw error
  }
}
