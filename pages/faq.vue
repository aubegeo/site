<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Foire Aux Questions (FAQ)</h1>
  
      <div class="space-y-6 text-base">
        <section>
          <h2 class="text-xl font-semibold">D'où viennent ces prix ?</h2>
          <p>Nous utilisons <a href="https://webservices.amazon.com/paapi5/documentation/" target="_blank" class="text-blue-600 underline">l'API Product Advertising d'Amazon</a> pour récupérer les informations sur les produits.</p>
            <p>Nous ne sommes pas responsables des erreurs de prix ou de disponibilité.</p>
        </section>
  
        <section>
          <h2 class="text-xl font-semibold">À quelle fréquence ce site est-il mis à jour ?</h2>
          <p>Les prix sont mis à jour régulièrement.</p>
        </section>
  
        <section>
          <h2 class="text-xl font-semibold">Pourquoi ce produit n'apparaît-il pas sur votre site ?</h2>
          <p>
            Nous filtrons activement notre liste de produits pour supprimer les doublons, les faux produits, les spams et les articles en rupture de stock.
            Cela entraîne la suppression d'environ 1,9 % de toutes les annonces.
          </p>
          <p>
            Dans certains cas, nos algorithmes ne parviennent pas à classer correctement les produits dans une catégorie connue. Ils peuvent donc être
            exclus involontairement. La liste des produits non classifiables est examinée régulièrement par un éditeur humain.
          </p>
          <p>
            Nous sommes également limités par les fonctionnalités de l’API Amazon, qui ne permet pas de récupérer plus de 100 éléments par requête et
            autorise un nombre limité de requêtes par jour. Cela entraîne l'exclusion de nombreux produits à faible classement.
          </p>
        </section>
  
        <section>
          <h2 class="text-xl font-semibold">Avez-vous besoin d’un graphiste ?</h2>
          <p>
            Non. Le design du site vise à maximiser la densité d'information, l’accessibilité et la performance.
            Ajouter des couleurs ou des icônes ne nous aide pas.
          </p>
        </section>
        <section>
          <h2 class="text-xl font-semibold">Et les frais de livraison ?</h2>
          <p>
            Les prix affichés n’incluent pas les frais de livraison ni les taxes. La plupart des produits ont une livraison gratuite,
            notamment si vous avez Amazon Prime. Vérifiez toujours les frais avant d’acheter.
          </p>
        </section>
  
        <section>
          <h2 class="text-xl font-semibold">Qui êtes-vous ?</h2>
          <p>
            aubegeo.com est une production de autogeo.
          </p>
        </section>
  
        <section>
          <h2 class="text-xl font-semibold">Êtes-vous un policier ?</h2>
          <p>
            Veuillez consulter notre <NuxtLink to="/privacy" class="text-blue-600 underline">politique de confidentialité</NuxtLink>.
          </p>
        </section>
  
        <section>
          <h2 class="text-xl font-semibold">Est-ce une publicité ?</h2>
          <p id="affiliation">
            Nous recevons une commission sur les produits achetés via les liens affiliés Amazon présents sur ce site à travers le programme
            <a href="https://affiliate-program.amazon.com/" target="_blank" class="text-blue-600 underline">Amazon Associates</a>.
            Cela ne vous coûte rien de plus et nous aide à maintenir le site.
          </p>
        </section>
      </div>
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
  </script>
  