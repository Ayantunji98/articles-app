import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Article, Category, Tag, ArticleForm, ArticleWithDetails } from '../types'

const initialCategories: Category[] = [
  { id: 1, name: 'Technology', createdAt: new Date() },
  { id: 2, name: 'Science', createdAt: new Date() },
  { id: 3, name: 'Health', createdAt: new Date() },
  { id: 4, name: 'Business', createdAt: new Date() },
]

const initialTags: Tag[] = [
  { id: 1, name: 'Vue.js', createdAt: new Date() },
  { id: 2, name: 'TypeScript', createdAt: new Date() },
  { id: 3, name: 'Frontend', createdAt: new Date() },
  { id: 4, name: 'Web Development', createdAt: new Date() },
  { id: 5, name: 'JavaScript', createdAt: new Date() },
]

const initialArticles: Article[] = [
  {
    id: 1,
    title: 'National Sucide Prevention',
    content: 'September is National Sucide Prevention Month. It is a time to raise awareness...',
    categoryId: 1,
    tagIds: [1, 2, 3],
    isArchived: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Deep Learning Advances',
    content: 'Recent advances in deep learning have led to significant improvements...',
    categoryId: 1,
    tagIds: [2, 5],
    isArchived: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
]

export const useArticlesStore = defineStore('articles', () => {
  // State
  const articles = ref<Article[]>(initialArticles)
  const categories = ref<Category[]>(initialCategories)
  const tags = ref<Tag[]>(initialTags)

  // Getters
  const nonArchivedArticles = computed(() =>
    articles.value.filter((article) => !article.isArchived),
  )

  const archivedArticles = computed(() => articles.value.filter((article) => article.isArchived))

  const getArticleWithDetails = (articleId: number): ArticleWithDetails | null => {
    const article = articles.value.find((a) => a.id === articleId)
    if (!article) return null

    const category = categories.value.find((c) => c.id === article.categoryId)
    const articleTags = tags.value.filter((t) => article.tagIds.includes(t.id))

    return {
      ...article,
      category: category!,
      tags: articleTags,
    }
  }

  const articlesWithDetails = computed(() =>
    nonArchivedArticles.value.map((article) => getArticleWithDetails(article.id)!),
  )

  // Actions
  const createArticle = (articleData: ArticleForm) => {
    const newArticle: Article = {
      id: Math.max(0, ...articles.value.map((a) => a.id)) + 1,
      title: articleData.title,
      content: articleData.content,
      categoryId: articleData.categoryId!,
      tagIds: articleData.tagIds,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    articles.value.push(newArticle)
    return newArticle
  }

  const updateArticle = (articleId: number, articleData: ArticleForm) => {
    const articleIndex = articles.value.findIndex((a) => a.id === articleId)
    if (articleIndex === -1) return null

    articles.value[articleIndex] = {
      ...articles.value[articleIndex],
      title: articleData.title,
      content: articleData.content,
      categoryId: articleData.categoryId!,
      tagIds: articleData.tagIds,
      updatedAt: new Date(),
    }

    return articles.value[articleIndex]
  }

  const archiveArticle = (articleId: number) => {
    const article = articles.value.find((a) => a.id === articleId)
    if (article) {
      article.isArchived = true
      article.updatedAt = new Date()
    }
  }

  const restoreArticle = (articleId: number) => {
    const article = articles.value.find((a) => a.id === articleId)
    if (article) {
      article.isArchived = false
      article.updatedAt = new Date()
    }
  }

  const deleteArticle = (articleId: number) => {
    articles.value = articles.value.filter((a) => a.id !== articleId)
  }

  return {
    // State
    articles,
    categories,
    tags,

    // Getters
    nonArchivedArticles,
    archivedArticles,
    articlesWithDetails,
    getArticleWithDetails,

    // Actions
    createArticle,
    updateArticle,
    archiveArticle,
    restoreArticle,
    deleteArticle,
  }
})
