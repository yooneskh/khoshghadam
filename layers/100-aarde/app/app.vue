<script setup>

const config = useAppConfig();


/* seo */

import { Analytics } from '@vercel/analytics/nuxt';


useHead({
  titleTemplate: t => `${t ? `${t} - ` : ''}${config.brand.title}`,
});

useSeoMeta({
  'description': 'Portfolio reimagined as the Nostalgia OS! My creative showcase of web development skills using Vue, Nuxt and Bun!',
});


useJsonld({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: config.brand.title,
  url: 'https://khoshghadam.com',
  description: 'Portfolio reimagined as the Nostalgia OS! My creative showcase of web development skills using Vue, Nuxt and Bun!',
  publisher: {
    "@type": "Person",
    name: 'Yoones Khoshghadam',
  },
  author: {
    "@type": "Person",
    name: 'Yoones Khoshghadam',
  },
  creator: {
    "@type": "Person",
    name: 'Yoones Khoshghadam',
  },
  copyrightHolder: {
    "@type": "Person",
    name: 'Yoones Khoshghadam',
  },
});

</script>


<template>
  <u-app>

    <nuxt-route-announcer />
    <nuxt-loading-indicator />

    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>

    <analytics />

  </u-app>
</template>
