<template>
  <div class="article-list">
    <div class="list-header">
      <h2>Articles</h2>
      <div class="filters">
        <select v-model="selectedCategory" @change="applyFilters">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <select v-model="selectedTag" @change="applyFilters">
          <option value="">All Tags</option>
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
        <select v-model="sortBy" @change="applySorting">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
    </div>

    <div v-if="filteredArticles.length === 0" class="empty-state">
      <p>No articles found.</p>
      <button @click="showCreateForm" class="btn-create">Create Your First Article</button>
    </div>

    <div v-else class="articles-grid">
      <article v-for="article in sortedArticles" :key="article.id" class="article-card">
        <div class="article-header">
          <h3 class="article-title" @click="viewArticle(article.id)">
            {{ article.title }}
          </h3>
          <div class="article-actions">
            <button @click="viewArticle(article.id)" class="btn-view" title="View">👁️</button>
            <button @click="editArticle(article.id)" class="btn-edit" title="Edit">✏️</button>
            <button @click="archiveArticle(article.id)" class="btn-archive" title="Archive">
              📁
            </button>
          </div>
        </div>

        <div class="article-meta">
          <span class="category">{{ article.category.name }}</span>
          <span class="date">{{ formatDate(article.createdAt) }}</span>
        </div>

        <p class="article-content-preview">
          {{ truncateContent(article.content) }}
        </p>

        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag.id" class="tag">
            {{ tag.name }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useArticlesStore } from '../stores/articles'
import type { ArticleWithDetails } from '../types'

// Define emits
const emit = defineEmits<{
  (e: 'view-article', id: number): void
  (e: 'edit-article', id: number): void
  (e: 'create-article'): void
}>()

// Store
const articlesStore = useArticlesStore()

// Reactive filters
const selectedCategory = ref('')
const selectedTag = ref('')
const sortBy = ref('newest')

// Get data from store
const categories = articlesStore.categories
const tags = articlesStore.tags

// Filtered articles based on category and tag
const filteredArticles = computed((): ArticleWithDetails[] => {
  let articles = articlesStore.articlesWithDetails

  // Filter by category
  if (selectedCategory.value) {
    const categoryId = parseInt(selectedCategory.value)
    articles = articles.filter((article) => article.categoryId === categoryId)
  }

  // Filter by tag
  if (selectedTag.value) {
    const tagId = parseInt(selectedTag.value)
    articles = articles.filter((article) => article.tagIds.includes(tagId))
  }

  return articles
})

// Sorted articles
const sortedArticles = computed((): ArticleWithDetails[] => {
  const articles = [...filteredArticles.value]

  switch (sortBy.value) {
    case 'newest':
      return articles.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    case 'oldest':
      return articles.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    case 'title':
      return articles.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return articles
  }
})

const viewArticle = (articleId: number) => {
  emit('view-article', articleId)
}

const editArticle = (articleId: number) => {
  emit('edit-article', articleId)
}

const showCreateForm = () => {
  emit('create-article')
}

const archiveArticle = (articleId: number) => {
  if (
    confirm(
      'Are you sure you want to archive this article? It will be moved to the archived section.',
    )
  ) {
    articlesStore.archiveArticle(articleId)
  }
}

const applyFilters = () => {}

const applySorting = () => {}

const truncateContent = (content: string): string => {
  const maxLength = 150
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.article-list {
  padding: 1rem 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header h2 {
  color: #2c3e50;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  color: #606266;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filters select:hover {
  border-color: #c0c4cc;
}

.filters select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.articles-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.article-card {
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.article-title {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
  flex: 1;
  cursor: pointer;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.article-title:hover {
  color: #409eff;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.article-actions button {
  background: none;
  border: 1px solid #e1e1e1;
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.article-actions button:hover {
  transform: scale(1.1);
}

.btn-view:hover {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

.btn-edit:hover {
  background: #e6a23c;
  border-color: #e6a23c;
  color: white;
}

.btn-archive:hover {
  background: #f56c6c;
  border-color: #f56c6c;
  color: white;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.category {
  background: #409eff;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.8rem;
}

.date {
  font-size: 0.8rem;
}

.article-content-preview {
  color: #5e6d82;
  margin-bottom: 1rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f0f9ff;
  color: #409eff;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  border: 1px solid #e1f5fe;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
  background: white;
  border-radius: 12px;
  border: 2px dashed #dcdfe6;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.btn-create {
  background: #409eff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-create:hover {
  background: #337ecc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    justify-content: center;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .article-header {
    flex-direction: column;
  }

  .article-actions {
    align-self: flex-end;
  }
}
</style>
