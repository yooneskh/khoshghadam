<script setup>

/* seo */

const config = useAppConfig();


useHead({
  titleTemplate: t => `${t ? `${t} - ` : ''}${config.brand.title}`,
});

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': config.brand.title,
  'url': 'https://khoshghadam.com',
  'publisher': {
    '@type': 'Person',
    'name': 'Yoones Khoshghadam',
  },
  'author': {
    '@type': 'Person',
    'name': 'Yoones Khoshghadam',
  },
  'creator': {
    '@type': 'Person',
    'name': 'Yoones Khoshghadam',
  },
  'copyrightHolder': {
    '@type': 'Person',
    'name': 'Yoones Khoshghadam',
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

  </u-app>
</template>
