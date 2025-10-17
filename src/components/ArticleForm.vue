<template>
  <div class="article-form">
    <h2>{{ isEditing ? 'Edit Article' : 'Create New Article' }}</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="title">Title *</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="Enter article title"
          :class="{ error: errors.title }"
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="category">Category *</label>
        <select id="category" v-model="formData.categoryId" :class="{ error: errors.categoryId }">
          <option value="">Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <span v-if="errors.categoryId" class="error-message">{{ errors.categoryId }}</span>
      </div>

      <div class="form-group">
        <label>Tags *</label>
        <div class="tags-selector">
          <div
            v-for="tag in tags"
            :key="tag.id"
            class="tag-option"
            :class="{ selected: formData.tagIds.includes(tag.id) }"
            @click="toggleTag(tag.id)"
          >
            {{ tag.name }}
          </div>
        </div>
        <span v-if="errors.tagIds" class="error-message">{{ errors.tagIds }}</span>
      </div>

      <div class="form-group">
        <label for="content">Content *</label>
        <textarea
          id="content"
          v-model="formData.content"
          rows="10"
          placeholder="Write your article content here..."
          :class="{ error: errors.content }"
        ></textarea>
        <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn-cancel">Cancel</button>
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticlesStore } from '../stores/articles'
import { validateArticleForm } from '../utils/validation'

interface Props {
  articleId?: number
}

interface Emits {
  (e: 'cancel'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const articlesStore = useArticlesStore()
const isSubmitting = ref(false)

const formData = ref({
  title: '',
  content: '',
  categoryId: null as number | null,
  tagIds: [] as number[],
})

const errors = ref({
  title: '',
  content: '',
  categoryId: '',
  tagIds: '',
})

const categories = articlesStore.categories
const tags = articlesStore.tags

const isEditing = computed(() => !!props.articleId)

onMounted(() => {
  if (props.articleId) {
    loadArticleData()
  }
})

const loadArticleData = () => {
  const article = articlesStore.getArticleWithDetails(props.articleId!)
  if (article) {
    formData.value = {
      title: article.title,
      content: article.content,
      categoryId: article.categoryId,
      tagIds: [...article.tagIds],
    }
  }
}

const toggleTag = (tagId: number) => {
  const index = formData.value.tagIds.indexOf(tagId)
  if (index > -1) {
    formData.value.tagIds.splice(index, 1)
  } else {
    formData.value.tagIds.push(tagId)
  }
}

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  const result = validateArticleForm(formData.value)

  if (!result.success) {
    if (result.errors) {
      result.errors.forEach((error) => {
        errors.value[error.path as keyof typeof errors.value] = error.message
      })
    }
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    if (isEditing.value) {
      articlesStore.updateArticle(props.articleId!, formData.value)
    } else {
      articlesStore.createArticle(formData.value)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving article:', error)
    alert('An error occurred while saving the article.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.article-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.article-form h2 {
  margin-bottom: 2rem;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3498db;
}

input.error,
select.error,
textarea.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.tags-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-option {
  background: #ecf0f1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.tag-option:hover {
  background: #d5dbdb;
}

.tag-option.selected {
  background: #3498db;
  color: white;
  border-color: #2980b9;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.btn-submit {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #229954;
}

.btn-submit:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
</style>
