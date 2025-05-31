<template>
  <section class="max-w-4xl mx-auto px-4 py-8">
    <SeoHead
      :seo="{ 
        title: 'Blog - Conseils & actualités sur les tablettes et liseuses', 
        description: 'Découvrez nos articles SEO optimisés sur les meilleures tablettes, liseuses, et les bons plans Amazon.', 
        url: 'https://tabletteprix.com/blog' 
      }"
    />

    <h1 class="text-3xl font-bold mb-8 text-gray-800">📚 Derniers articles</h1>

<div v-if="pending" class="space-y-4">
  <div v-for="i in 3" :key="i" class="animate-pulse">
    <div class="h-32 bg-gray-100 rounded-xl"></div>
  </div>
</div>

<div v-else class="grid gap-6">
  <NuxtLink 
    v-for="article in articles" 
    :key="article._path"
    :to="article._path"
    class="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100"
  >
    <article>
      <h2 class="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
        {{ article.title }}
      </h2>
      <p class="text-gray-600 mb-4 line-clamp-2">{{ article.description }}</p>
      <div class="flex items-center text-sm text-gray-500">
        <time v-if="article.date" class="flex items-center">
          <span class="mr-2">📅</span>
          {{ new Date(article.date).toLocaleDateString('fr-FR') }}
        </time>
        <div v-if="article.tags" class="flex gap-2 ml-4 flex-wrap">
          <span 
            v-for="tag in article.tags" 
            :key="tag" 
            class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </article>
  </NuxtLink>
</div>
</section>
</template>

<script setup lang="ts">
import { useAsyncData } from '#app'
import { queryCollectionNavigation } from '#imports'
import type { Article } from '~/types/content'

const { data: articles, pending, error } = await useAsyncData<Article[]>("articles", async () => {
  try {

   // const result = await queryCollection<Article>("content").all()
   const result = await queryCollection<Article>("content").where('path', 'LIKE', '%articles%').all()
    const currentDate = new Date().setHours(0, 0, 0, 0) // Date du jour à minuit

    console.log("Debug: Articles fetched:", result)
     return result.filter(article => {
        const articleDate = new Date(article.meta.date || '').setHours(0, 0, 0, 0)
        return articleDate <= currentDate // Filtre les articles futurs
      }).map(article => ({
      ...article,
      path: `/blog${article.path?.replace('/articles', '')}`,
      _path: `/blog${article.path?.replace('/articles', '')}`, // Adjust path to match `/blog`
    })).sort((a: Article, b: Article) => {
      const dateA = new Date(a.meta.date).getTime()
      const dateB = new Date(b.meta.date).getTime()
      return dateB - dateA // Sort by date descending
    }); 
  } catch (err) {
    console.error('Failed to load articles:', err)
    return []
  }
})

// Show error in development
if (process.dev && error.value) {
  console.error('Failed to load articles:', error.value)
}
</script>

<style scoped>
.group {
  text-decoration: none !important;
  cursor: pointer;
}

.group:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
