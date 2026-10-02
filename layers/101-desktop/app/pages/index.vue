<script setup>

/* responsibility */

// Serves the desktop home route
// and sets its portfolio SEO.


/* page */

definePageMeta({
  name: 'desktop.home',
});


/* seo */

useHead({
  title: '',
});

useSeoMeta({
  description: 'Portfolio reimagined as the Nostalgia OS! My creative showcase of web development skills using Vue, Nuxt and Bun!',
});

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Yoones',
  'description': 'Portfolio reimagined as the Nostalgia OS! My creative showcase of web development skills using Vue, Nuxt and Bun!',
  'url': 'https://khoshghadam.com',
});

</script>


<template>
  <div />
</template>
