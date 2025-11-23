<script setup>

const config = useAppConfig();


/* seo */

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
  <u-app
    :tooltip="{
      delayDuration: 0,
    }">

    <nuxt-route-announcer />
    <nuxt-loading-indicator />

    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>

  </u-app>
</template>
