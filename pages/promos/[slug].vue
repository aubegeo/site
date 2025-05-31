<template>
  <article class="promo-container">
    <SeoHead :seo="seo" />

    <header class="promo-header">
      <h1 class="promo-title">{{ promo?.title }}</h1>
      <div class="promo-meta">
        <span class="promo-brand">{{ promo?.meta?.marque }}</span>
        <time>{{ promo?.meta?.date ? formatDate(promo.meta.date) : 'Date inconnue' }}</time>
      </div>
    </header>

    <div class="promo-image">
      <img :src="promo?.meta?.image" :alt="promo?.title" />
    </div>

    <section class="promo-details">
      <p class="promo-description">{{ promo?.description }}</p>
      <div class="promo-pricing">
        <span class="current-price">{{ formatPrice(promo?.meta?.prix) }}</span>
        <span
          v-if="promo?.meta?.prix_original"
          class="original-price"
        >{{ formatPrice(promo.meta.prix_original) }}</span>
        <span v-if="reductionPercent" class="promo-badge">-{{ reductionPercent }}%</span>
      </div>
      <NuxtLink
        class="promo-button"
        :to="promo?.meta?.lien_affilie"
        target="_blank"
        rel="noopener"
      >
        Voir l'offre
      </NuxtLink>
    </section>

    <section class="promo-specs">
      <ul>
        <li><strong>Stockage :</strong> {{ promo?.meta?.stockage }}</li>
        <li><strong>Écran :</strong> {{ promo?.meta?.ecran }}</li>
        <li><strong>Système :</strong> {{ promo?.meta?.systeme }}</li>
      </ul>
    </section>

    <div class="promo-promo-content">
      <ContentRenderer :value="promo" />
    </div>
    <div v-if="promo?.meta?.tags" class="promo-tags">
      <span v-for="tag in promo.meta.tags" :key="tag" class="promo-tag">
        #{{ tag }}
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SeoHead from '@/components/SeoHead.vue';

const route = useRoute();

const { data: promo } = await useAsyncData("promo", async () => {
  const result = await queryCollection("content").all();
  return result.find((item) => item.path === `/promos/${route.params.slug}`) || null;
});

const reductionPercent = computed(() => {
  const prix = promo.value?.meta?.prix;
  const original = promo.value?.meta?.prix_original;
  if (!prix || !original || prix >= original) return null;
  return Math.round(((original - prix) / original) * 100);
});

function formatPrice(value: number | undefined) {
  if (!value) return '';
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Date inconnue';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const seo = {
  title: promo.value?.title || 'Promotion tablette',
  description: promo.value?.description || '',
  image: promo.value?.meta?.image || '/default-image.jpg',
  date: promo.value?.meta?.date || new Date().toISOString(),
  author: promo.value?.meta?.marque || 'Marque inconnue',
  ogTitle: promo.value?.title || '',
  ogDescription: promo.value?.description || '',
  ogImage: promo.value?.meta?.image || '/default-image.jpg'
};
</script>

<style scoped>
.promo-container {
  max-width: 768px;
  margin: auto;
  padding: 2rem 1rem;
  font-family: 'Georgia', serif;
}

.promo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.promo-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #1a202c;
}

.promo-meta {
  font-size: 0.9rem;
  color: #718096;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.promo-brand {
  font-style: italic;
}

.promo-image img {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 2rem auto;
  display: block;
}

.promo-details {
  text-align: center;
  margin-bottom: 2rem;
}

.promo-description {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.promo-pricing {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
}

.current-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e53e3e;
}

.original-price {
  text-decoration: line-through;
  color: #a0aec0;
  font-size: 1rem;
}

.promo-badge {
  background-color: #f56565;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.promo-button {
  display: inline-block;
  background-color: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.promo-button:hover {
  background-color: #2b6cb0;
}

.promo-specs ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  font-size: 1rem;
  line-height: 1.6;
}

.promo-specs li {
  margin-bottom: 0.5rem;
}

.promo-tags {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.promo-tag {
  background-color: #edf2f7;
  color: #4a5568;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.promo-promo-content {
  margin-top: 2rem;
}
</style>
