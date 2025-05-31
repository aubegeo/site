<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation - Ajout de w-full pour occuper toute la largeur -->
    <header class="w-full sticky top-0 bg-white shadow-md z-50">
      <nav class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="shrink-0">
            <span class="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Aubege
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8">
            <NuxtLink 
              v-for="(link, index) in navLinks" 
              :key="index"
              :to="link.to" 
              class="nav-link"
              active-class="nav-link-active"
            >
              {{ link.text }}
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            class="lg:hidden rounded-lg p-2 hover:bg-gray-100" 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Menu"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                v-if="!isMobileMenuOpen" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation - Ajout de w-full -->
        <div 
          v-show="isMobileMenuOpen" 
          class="w-full lg:hidden py-2 space-y-1"
        >
          <NuxtLink 
            v-for="(link, index) in navLinks" 
            :key="index"
            :to="link.to" 
            class="block w-full mobile-nav-link"
            active-class="mobile-nav-link-active"
          >
            {{ link.text }}
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NuxtPage />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-6">
          <div class="space-y-2">
            <p class="text-sm text-gray-500">
              Ce site est financé par des liens affiliés.
              <NuxtLink to="/faq#affiliation" class="text-blue-600 hover:text-blue-800 underline">
                En savoir plus
              </NuxtLink>
            </p>
          </div>
          <nav class="flex justify-center space-x-6">
            <NuxtLink to="/privacy" class="text-sm text-gray-500 hover:text-blue-600">
              Politique de confidentialité
            </NuxtLink>
          </nav>
          <p class="text-sm text-gray-400">
            © {{ new Date().getFullYear() }} TablettePrix - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', text: 'Accueil' },
  { to: '/blog', text: 'Blog' },
  { to: '/promos', text: 'Promos' }
]

// Close mobile menu when route changes
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<style>
/* Update styles to ensure full width */
.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative w-full;
}

.mobile-nav-link {
  @apply block w-full px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors;
}
.nav-link-active {
  @apply text-blue-600;
}

.nav-link-active::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-blue-600;
}

.mobile-nav-link-active {
  @apply bg-blue-50 text-blue-600;
}
</style>