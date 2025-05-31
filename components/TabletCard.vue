<template>
   <tr v-if="header" class="bg-gray-200">
    <th 
      v-for="column in columns" 
      :key="column.key"
      @click="$emit('sort', column.key)"
      class="px-2 py-1 border cursor-pointer hover:bg-gray-300"
    >
      {{ column.label }}
      <span v-if="sortKey === column.key" class="ml-1">
        {{ sortDirection === 'asc' ? '↑' : '↓' }}
      </span>
    </th>
    <th v-if="isDev" class="px-2 py-1 border">Actions</th>
  </tr>
  <tr v-else class="bg-white">
    <td class="px-2 py-1 border">{{ tablet.name }}</td>
    <td class="px-2 py-1 border">{{ tablet.description }}</td>
    <td class="px-2 py-1 border">{{ tablet.price }} €</td>
    <td class="px-2 py-1 border">
      <a v-if="tablet.link" :href="tablet.link" target="_blank" class="text-blue-500 hover:underline">Voir</a>
    </td>
    <td class="px-2 py-1 border">{{ tablet.brand }}</td>
    <td class="px-2 py-1 border">{{ tablet.model }}</td>
    <td class="px-2 py-1 border">{{ tablet.storage }}</td>
    <td class="px-2 py-1 border">{{ tablet.screenSize }}</td>
    <td class="px-2 py-1 border">{{ tablet.os }}</td>
    <td class="px-2 py-1 border">{{ tablet.modelYear }}</td>
    <td class="px-2 py-1 border">{{ tablet.gpu }}</td>
    <td class="px-2 py-1 border">{{ tablet.cpu }}</td>
    <td class="px-2 py-1 border">{{ tablet.ram }}</td>
    <td class="px-2 py-1 border">{{ tablet.resolution }}</td>
    <td class="px-2 py-1 border">{{ tablet.hardwareInterface }}</td>
    <td class="px-2 py-1 border">{{ tablet.wirelessTech }}</td>
    <td v-if="isDev" class="px-2 py-1 border">
      <button @click="$emit('edit')" class="text-blue-600 hover:text-blue-800 text-xs mr-1" title="Modifier">✎</button>
      <button @click="$emit('delete')" class="text-red-600 hover:text-red-800 text-xs" title="Supprimer">✕</button>
    </td>
  </tr>
</template>

<script setup>
import { defaultMeta } from '@/utils/seo.meta'

useSeoMeta({
  title: defaultMeta.title,
  description: defaultMeta.description,
  ogTitle: defaultMeta.ogTitle,
  ogDescription: defaultMeta.ogDescription,
  ogImage: defaultMeta.ogImage,
  twitterCard: defaultMeta.twitterCard,
  ogSiteName: defaultMeta.siteName,
  robots: 'index, follow',
})
const isDev = process.env.NODE_ENV === 'development'

defineProps({
  tablet: {
    type: Object,
    default: () => ({})
  },
  header: {
    type: Boolean,
    default: false
  },
  sortKey: {
    type: String,
    default: ''
  },
  sortDirection: {
    type: String,
    default: 'asc'
  }
})

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'description', label: 'Description' },
  { key: 'price', label: 'Prix (€)' },
  { key: 'link', label: 'Lien' },
  { key: 'brand', label: 'Marque' },
  { key: 'model', label: 'Modèle' },
  { key: 'storage', label: 'Stockage' },
  { key: 'screenSize', label: 'Taille écran' },
  { key: 'os', label: 'Système' },
  { key: 'modelYear', label: 'Année' },
  { key: 'gpu', label: 'GPU' },
  { key: 'cpu', label: 'CPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'resolution', label: 'Résolution' },
  { key: 'hardwareInterface', label: 'Interface' },
  { key: 'wirelessTech', label: 'Sans fil' }
]

</script>

<style scoped>
.bg-white {
  @apply p-4 rounded-xl shadow-md;
}

th {
  transition: background-color 0.2s;
}

th:hover {
  @apply bg-gray-300;
}
</style>
