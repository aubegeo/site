<template>
    <div class="prose mx-auto px-4 py-8">
      <h1>Politique de confidentialité</h1>
  
      <p>Votre adresse IP peut être enregistrée et conservée pendant une durée maximale de 30 jours à des fins de débogage et de prévention des abus.</p>
  
      <p>Des informations anonymisées sur le référent HTTP peuvent être envoyées à nos serveurs à des fins d’analyse et peuvent être conservées indéfiniment.</p>
  
      <p>Nous ne partageons aucune information concernant nos utilisateurs avec des tiers.</p>
  
      <h2>Cookies</h2>
      <p>Les parties publiques de ce site ne déposent pas de cookies.</p>
  
      <h2>Programme d’affiliation Amazon</h2>
      <p>Amazon peut déposer des cookies supplémentaires pour associer vos achats à notre code d’affiliation après que vous ayez cliqué sur un lien produit. Ces cookies sont définis sur les domaines d’Amazon et ne sont jamais envoyés à aubegeo.com.</p>
  
      <p>Les prix et la disponibilité des produits sont exacts à la date et à l’heure indiquées, et peuvent être modifiés. Les informations sur le prix et la disponibilité affichées au moment de l’achat s’appliqueront à cet achat.</p>
  
      <p>Nous participons au programme Amazon Services LLC Associates, un programme d’affiliation conçu pour permettre aux sites de percevoir une rémunération grâce à la création de liens vers Amazon.com et ses sites affiliés.</p>
  
      <p><strong>CERTAINS CONTENUS AFFICHÉS SUR CE SITE PROVIENNENT D’AMAZON SERVICES LLC. CES CONTENUS SONT FOURNIS "EN L’ÉTAT" ET SONT SUSCEPTIBLES D’ÊTRE MODIFIÉS OU SUPPRIMÉS À TOUT MOMENT.</strong></p>
  
    </div>
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
  useHead({
    title: 'Politique de confidentialité',
  })
  </script>
  
  <style scoped>
  .prose {
    max-width: 800px;
  }
  </style>
  