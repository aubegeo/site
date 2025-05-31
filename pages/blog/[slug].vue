<template>
  <article class="article-container">
    <SeoHead :seo="seo" />
    
    <header class="article-header">
      <h1 class="article-title">{{ article?.title }}</h1>
      <div class="article-meta">
        <time>{{ article?.meta?.date ? formatDate(article?.meta?.date) : 'Date inconnue' }}</time>
        <span class="article-author">Par {{ article?.meta?.author || 'Auteur inconnu' }}</span>
      </div>
    </header>

    <div v-if="article?.meta?.image" class="article-image">
      <img :src="article?.meta?.image" :alt="article?.title" />
    </div>

    <div class="article-content">
      <ContentRenderer :value="article" />
    </div>

      <!-- Tags Section -->
      <div v-if="article?.meta?.tags" class="article-tags">
        <h3 class="tags-title">Tags</h3>
        <div class="tags-container">
          <span 
            v-for="tag in article.meta.tags" 
            :key="tag" 
            class="tag-badge"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

    <!-- Similar Articles Section -->
    <div v-if="similarArticles?.length" class="similar-articles">
      <h3 class="similar-title">Articles similaires</h3>
      <div class="similar-grid">
        <NuxtLink
          v-for="similar in similarArticles"
          :key="similar.path"
          :to="similar.path"
          class="similar-article"
        >
          <h4>{{ similar.title }}</h4>
          <p>{{ similar.description }}</p>
        </NuxtLink>
      </div>
    </div>

    <hr class="article-divider" />
  </article>
</template>
  
  <script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
import SeoHead from '@/components/SeoHead.vue';
import type { Article } from '~/types/content/article';

const route = useRoute();
const router = useRouter();

// Watch for route changes to refresh data
watch(
  () => route.params.slug,
  async (newSlug) => {
    await refreshNuxtData('article')
    await refreshNuxtData('similarArticles')
  }
)
  
const { data: article, error } = await useAsyncData("article", async () => {
  const result = await queryCollection("content").all();
  return result.find((item) => item.path === `/articles/${route.params.slug}`) || null;
}, {
  watch: [route.params.slug] // Add this to watch for route changes
});

const { data: similarArticles } = await useAsyncData("similarArticles", async () => {
  const result = await queryCollection<Article>("content").where('path', 'LIKE', '%articles%').all()
    return result
    .filter((item) => 
      item.path !== article.value?.path && // Exclude current article
      item.meta?.tags?.some((tag: string) => article.value?.meta?.tags?.includes(tag)) // Has at least one common tag
    )
    .slice(0, 4)
    .map(similar => ({
      ...similar,
      path: `/blog${similar.path.replace('/articles', '')}`,
      _path: `/blog${similar.path.replace('/articles', '')}`
    }));
}, {
  watch: [() => article.value?.path] // Add this to watch for article changes
});


  // Génération SEO
  const seo = {
    title: article.value?.title || 'Titre par défaut',
    description: article.value?.description || 'Description par défaut',
    image: article.value?.image || '/default-image.jpg',
    date: article.value?.date || new Date().toISOString(),
    author: article.value?.author || 'Auteur inconnu',
    ogTitle: article.value?.title || 'Titre par défaut',
    ogDescription: article.value?.description || 'Description par défaut',
    ogImage: article.value?.image || '/default-image.jpg'
  };
  function formatDate(dateStr: string): string {
  if (!dateStr) return 'Date inconnue';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  }
  
  </script>
  
  <style scoped>
  .article-container {
    max-width: 768px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    font-family: "Georgia", serif;
    line-height: 1.8;
    color: #2d3748;
    background-color: #fff;
  }
  
  .article-header {
    margin-bottom: 3rem;
    text-align: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 2rem;
  }
  
  .article-title {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: #1a202c;
    font-family: "Times New Roman", serif;
  }
  
  .article-meta {
    font-size: 0.875rem;
    color: #718096;
    font-style: italic;
  }
  
  .article-author {
    margin-left: 0.5rem;
  }
  
  .article-content {
    font-size: 1.125rem;
    margin: 2rem 0;
  }
  
  .article-content :deep(p) {
    margin-bottom: 1.5rem;
    text-align: justify;
  }
  
  .article-content :deep(h2) {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 2.5rem 0 1.5rem;
    font-family: "Times New Roman", serif;
    color: #2d3748;
  }
  
  .article-content :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 2rem auto;
    border-radius: 4px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .article-content :deep(blockquote) {
    font-style: italic;
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    margin: 2rem 0;
    color: #4a5568;
  }
  
  .article-divider {
    margin: 3rem 0;
    border: none;
    border-top: 1px solid #e2e8f0;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 640px) {
    .article-container {
      padding: 0 1rem;
    }
  
    .article-title {
      font-size: 2rem;
    }
  
    .article-content {
      font-size: 1rem;
    }
  }
  
  /* Style pour les liens dans l'article */
  .article-content :deep(a) {
    color: #2b6cb0;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    transition: color 0.2s;
  }
  
  .article-content :deep(a:hover) {
    color: #1a4971;
  }
  
  /* Style pour les listes */
  .article-content :deep(ul), 
  .article-content :deep(ol) {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }
  
  .article-content :deep(li) {
    margin-bottom: 0.5rem;
  }
  .article-tags {
  margin: 3rem 0;
}

.tags-title {
  font-family: "Times New Roman", serif;
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-link {
  background-color: #f7fafc;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  text-decoration: none;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.tag-link:hover {
  background-color: #edf2f7;
  color: #2b6cb0;
}

.similar-articles {
  margin: 3rem 0;
}

.similar-title {
  font-family: "Times New Roman", serif;
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.similar-article {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s;
}

.similar-article:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.similar-article h4 {
  font-family: "Times New Roman", serif;
  font-size: 1.125rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.similar-article p {
  font-size: 0.875rem;
  color: #718096;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-image img {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 2rem auto;
  display: block;
}

@media (max-width: 640px) {
  .similar-grid {
    grid-template-columns: 1fr;
  }
}
  </style>