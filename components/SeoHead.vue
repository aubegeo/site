<template>
  <Head>
    <Title>{{ seo.title }}</Title>
    <Meta name="description" :content="seo.description" />
    <Meta property="og:title" :content="seo.title" />
    <Meta property="og:description" :content="seo.description" />
    <Meta property="og:image" :content="seo.image" />
    <Meta property="og:type" content="article" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" :content="seo.title" />
    <Meta name="twitter:description" :content="seo.description" />
    <Meta name="twitter:image" :content="seo.image" />
  </Head>
</template>

<script>
import { defineComponent } from 'vue';
import { useHead } from '@vueuse/head';

export default defineComponent({
  name: 'SeoHead',
  props: {
    seo: {
      type: Object,
      required: true,
      default: () => ({
        title: 'Titre par défaut',
        description: 'Description par défaut',
        image: '/default-image.jpg',
        date: new Date().toISOString(),
        author: 'Auteur inconnu'
      })
    }
  },
  setup(props) {
    const structuredData = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": props.seo.title,
      "image": [props.seo.image],
      "datePublished": props.seo.date,
      "author": [{ "@type": "Person", "name": props.seo.author }]
    });

    useHead({
      link: [
        { rel: 'canonical', href: 'https://tabletteprix.com/' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: structuredData
        }
      ]
    });

    return {};
  }
});
</script>