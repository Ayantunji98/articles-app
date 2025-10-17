<template>
  <div class="article-detail" v-if="article">
    <div class="detail-header">
      <button @click="$emit('back')" class="btn-back">← Back to List</button>
      <div class="header-actions">
        <button @click="$emit('edit-article', article.id)" class="btn-edit">Edit</button>
        <button @click="archiveArticle" class="btn-archive">Archive</button>
      </div>
    </div>

    <article class="article-content">
      <header class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="category">{{ article.category.name }}</span>
          <span class="date">Published on {{ formatDate(article.createdAt) }}</span>
          <span v-if="article.updatedAt !== article.createdAt" class="date">
            • Updated on {{ formatDate(article.updatedAt) }}
          </span>
        </div>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag.id" class="tag">
            {{ tag.name }}
          </span>
        </div>
      </header>

      <div class="article-body">
        <p class="article-text">{{ article.content }}</p>
      </div>
    </article>
  </div>

  <div v-else class="not-found">
    <h2>Article not found</h2>
    <button @click="$emit('back')" class="btn-back">← Back to List</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArticlesStore } from '../stores/articles'

interface Props {
  articleId: number
}

interface Emits {
  (e: 'back'): void
  (e: 'edit-article', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const articlesStore = useArticlesStore()

const article = computed(() => articlesStore.getArticleWithDetails(props.articleId))

const archiveArticle = () => {
  if (confirm('Are you sure you want to archive this article?')) {
    articlesStore.archiveArticle(props.articleId)
    emit('back')
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.article-detail {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-archive {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background: #f39c12;
  color: white;
}

.btn-archive {
  background: #e74c3c;
  color: white;
}

.btn-edit:hover {
  background: #e67e22;
}

.btn-archive:hover {
  background: #c0392b;
}

.article-content {
  padding: 2rem;
}

.article-header {
  margin-bottom: 2rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 1rem;
}

.article-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.category {
  background: #3498db;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-weight: 600;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e8f4fd;
  color: #2980b9;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.article-body {
  line-height: 1.8;
}

.article-text {
  white-space: pre-wrap;
  font-size: 1.1rem;
  color: #444;
}

.not-found {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
  color: #e74c3c;
  margin-bottom: 1rem;
}
</style>
