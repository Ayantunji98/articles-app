export interface Category {
  id: number
  name: string
  createdAt: Date
}

export interface Tag {
  id: number
  name: string
  createdAt: Date
}

export interface Article {
  id: number
  title: string
  content: string
  categoryId: number
  tagIds: number[]
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ArticleForm {
  title: string
  content: string
  categoryId: number | null
  tagIds: number[]
}

// For display purposes with resolved relationships
export interface ArticleWithDetails extends Article {
  category: Category
  tags: Tag[]
}
