<template>
  <section class="max-w-4xl mx-auto px-4 py-8">
    <SeoHead
      :seo="{ 
        title: 'Promotions - Conseils & actualités sur les tablettes et liseuses', 
        description: 'Découvrez nos promotions  SEO optimisés sur les meilleures tablettes, liseuses, et les bons plans Amazon.', 
        url: 'https://tabletteprix.com/promos' 
      }"
    />

    <h1 class="text-3xl font-bold mb-8 text-gray-800">📚 Dernieres promotions</h1>

<div v-if="pending" class="space-y-4">
  <div v-for="i in 3" :key="i" class="animate-pulse">
    <div class="h-32 bg-gray-100 rounded-xl"></div>
  </div>
</div>

<div v-else class="grid gap-6">
  <NuxtLink 
    v-for="promo in promos" 
    :key="promo._path"
    :to="promo._path"
    class="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100"
  >
    <article>
      <h2 class="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
        {{ formatDate(promo.meta?.date) }} : {{ promo.title }}
      </h2>
      <p class="text-gray-600 mb-4 line-clamp-2">{{ promo.description }}</p>
      <div class="flex items-center text-sm text-gray-500">
        <time v-if="promo.date" class="flex items-center">
          <span class="mr-2">📅</span>
          {{ new Date(promo.date).toLocaleDateString('fr-FR') }}
        </time>
        <div v-if="promo.tags" class="flex gap-2 ml-4 flex-wrap">
          <span 
            v-for="tag in promo.tags" 
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
import type { Promo } from '~/types/content/promo';


const { data: promos, pending, error } = await useAsyncData<Promo[]>("promos", async () => {
  try {

   // const result = await queryCollection<promo>("content").all()
   const result = await queryCollection<Promo>("content").where('path', 'LIKE', '%promos%').all()

    console.log("Debug: Promos fetched:", result)
     return result.map(promo => ({
      ...promo,
      path: `/promos${promo.path?.replace('/promos', '')}`, // Adjust path to match `/promos`
      _path: `/promos${promo.path?.replace('/promos', '')}`, // Adjust path to match `/promos`
    })).sort((a: Promo, b: Promo) => {
      const dateA = new Date(a.meta.date).getTime()
      const dateB = new Date(b.meta.date).getTime()
      return dateB - dateA // Sort by date descending
    });  
  } catch (err) {
    console.error('Failed to load promos:', err)
    return []
  }
})

// Add date formatter function
const formatDate = (date: string) => {
  if (!date) return ''
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Date(date).toLocaleDateString('fr-FR', options)
}

// Show error in development
if (process.dev && error.value) {
  console.error('Failed to load promos:', error.value)
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

