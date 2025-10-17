<template>
  <div class="archived-articles">
    <div class="header">
      <h2>Archived Articles</h2>
      <button @click="$emit('back')" class="btn-back">← Back to Articles</button>
    </div>

    <div v-if="archivedArticles.length === 0" class="empty-state">No archived articles found.</div>

    <div v-else class="articles-list">
      <article v-for="article in archivedArticles" :key="article.id" class="article-card archived">
        <div class="article-header">
          <h3 class="article-title">{{ article.title }}</h3>
          <div class="article-actions">
            <button @click="restoreArticle(article.id)" class="btn-restore">Restore</button>
            <button @click="deleteArticle(article.id)" class="btn-delete">Delete</button>
          </div>
        </div>

        <div class="article-meta">
          <span class="category">{{ article.category.name }}</span>
          <span class="date">Archived on {{ formatDate(article.updatedAt) }}</span>
        </div>

        <p class="article-content-preview">{{ article.content.substring(0, 150) }}...</p>

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
import { computed } from 'vue'
import { useArticlesStore } from '../stores/articles'

defineEmits<{
  back: []
  'restore-article': []
}>()

const articlesStore = useArticlesStore()

const archivedArticles = computed(() =>
  articlesStore.archivedArticles.map((article) => articlesStore.getArticleWithDetails(article.id)!),
)

const restoreArticle = (articleId: number) => {
  if (confirm('Restore this article?')) {
    articlesStore.restoreArticle(articleId)
  }
}

const deleteArticle = (articleId: number) => {
  if (
    confirm(
      'Are you sure you want to permanently delete this article? This action cannot be undone.',
    )
  ) {
    articlesStore.deleteArticle(articleId)
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.archived-articles {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-back {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-back:hover {
  background: #5a6268;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-card.archived {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  opacity: 0.8;
}

.article-card.archived:hover {
  opacity: 1;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.article-actions button {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-restore {
  background: #27ae60;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.article-actions button:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
  border: 2px dashed #bdc3c7;
}
</style>
