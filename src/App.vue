<template>
  <div id="app">
    <header class="app-header">
      <h1>Simple Articles Management</h1>
      <nav class="nav">
        <button @click="currentView = 'list'" :class="{ active: currentView === 'list' }">
          📝 Articles
        </button>
        <button @click="currentView = 'create'" :class="{ active: currentView === 'create' }">
          ➕ Create Article
        </button>
        <button @click="currentView = 'archived'" :class="{ active: currentView === 'archived' }">
          📁 Archived Articles
        </button>
      </nav>
    </header>

    <main class="main-content">
      <ArticleList
        v-if="currentView === 'list'"
        @edit-article="handleEditArticle"
        @view-article="handleViewArticle"
        @create-article="currentView = 'create'"
      />
      <ArticleForm
        v-else-if="currentView === 'create'"
        @cancel="handleCancel"
        @saved="handleArticleSaved"
      />
      <ArticleForm
        v-else-if="currentView === 'edit'"
        :article-id="editingArticleId"
        @cancel="handleCancel"
        @saved="handleArticleSaved"
      />
      <ArchivedArticles
        v-else-if="currentView === 'archived'"
        @back="currentView = 'list'"
        @restore-article="handleRestoreArticle"
      />
      <ArticleDetail
        v-else-if="currentView === 'detail'"
        :article-id="viewingArticleId!"
        @back="currentView = 'list'"
        @edit-article="handleEditArticleFromDetail"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ArticleForm from './components/ArticleForm.vue'
import ArticleDetail from './components/ArticleDetail.vue'
import ArchivedArticles from './components/ArchivedArticles.vue'
import ArticleList from './components/ArticleList.vue'

type ViewMode = 'list' | 'create' | 'edit' | 'archived' | 'detail'

const currentView = ref<ViewMode>('list')
const editingArticleId = ref<number | undefined>(undefined)
const viewingArticleId = ref<number | null>(null)

const handleEditArticle = (articleId: number) => {
  editingArticleId.value = articleId
  currentView.value = 'edit'
}

const handleViewArticle = (articleId: number) => {
  viewingArticleId.value = articleId
  currentView.value = 'detail'
}

const handleEditArticleFromDetail = (articleId: number) => {
  editingArticleId.value = articleId
  currentView.value = 'edit'
}

const handleArticleSaved = () => {
  currentView.value = 'list'
  editingArticleId.value = undefined
  viewingArticleId.value = null
}

const handleCancel = () => {
  currentView.value = 'list'
  editingArticleId.value = undefined
  viewingArticleId.value = null
}

const handleRestoreArticle = () => {
  console.log('Article restored')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header h1 {
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav button {
  background: transparent;
  border: 1px solid #34495e;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
}

.nav button:hover {
  background: #34495e;
  border-color: #4a6572;
  transform: translateY(-1px);
}

.nav button.active {
  background: #3498db;
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 1.5rem;
    text-align: center;
  }

  .nav {
    justify-content: center;
  }

  .nav button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .nav {
    flex-direction: column;
    align-items: center;
  }

  .nav button {
    width: 200px;
  }
}
</style>
