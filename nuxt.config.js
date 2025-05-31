export default {
  // Utilisez le mode 'static' pour générer des fichiers statiques
  target: 'static',
  nitro: {
    firebase: {
      gen: 2,
      nodeVersion: '20'
    },
    routeRules: {
      '/': { redirect: false },
    }
  },

  // Activez ou désactivez le SSR en fonction de vos besoins
  ssr: true,

  generate: {
    fallback: true // Ajoutez un fichier 404.html pour gérer les erreurs
  },

  layoutTransition: 'default',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'tablet-app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
      '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/firebase.ts'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],
  modules: [
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/image',
  ],
  content: {
    configPath: 'content/config.yaml',
    liveEdit: true, // Disable live editing in development mode
    markdown: {
      remarkPlugins: [], // Add remark plugins if needed
      rehypePlugins: [], // Add rehype plugins if needed
    },
    nestedProperties: ['tags'], // Enable nested properties like 'tags'
    documentDriven: true,
    api: {
      baseURL: '/api/_content'
    }
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  //modules: ['@nuxtjs/i18n'],
  i18n: {
    vueI18n: {
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          tablets: 'Tablets',
          name: 'Name',
          description: 'Description',
          price: 'Price',
          link: 'Link',
          add_tablet: 'Add Tablet'
        },
        fr: {
          tablets: 'Tablettes',
          name: 'Nom',
          description: 'Description',
          price: 'Prix',
          link: 'Lien',
          add_tablet: 'Ajouter une tablette'
        }
      }
    }
  },
  sitemap: {
    gzip: true,
    hostname: 'https://tabletteprix.com', // ⚡ Mets ton vrai nom de domaine ici
    trailingSlash: true,
    i18n: true, // <=== Active le multilingue automatique
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: () => new Date(), // <=== Met à jour automatiquement la date de modification
    },
    routes: [
      {
        url: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: () => new Date()
      },
      {
        url: '/faq',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: () => new Date()
      },
      {
        url: '/privacy',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: () => new Date()
      }
    ]
  },
  image: {
    dir: 'public/images',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      blog: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 1200,
          height: 630
        }
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          quality: 70,
          width: 800,
          height: 600
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
      transpile: ['firebase', '@firebase/auth', '@nuxt/content'],
      rollupOptions: {
        external: ['#content'],
      },
  },

  vite: {
    optimizeDeps: {
      include: ['@nuxt/content'],
    },
  },

  compatibilityDate: '2025-04-07'
};