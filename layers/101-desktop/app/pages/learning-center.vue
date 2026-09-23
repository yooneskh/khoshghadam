<script setup>

/* page */

definePageMeta({
  name: 'desktop.learning-center',
});


/* seo */

useHead({
  title: 'Learning Center',
});

useSeoMeta({
  description: 'Browse flash card lessons and structured learning journeys.',
});

useJsonld({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Learning Center',
          'item': 'https://khoshghadam.com/learning-center',
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      'name': 'Learning Center',
      'description': 'Browse flash card lessons and structured learning journeys.',
      'url': 'https://khoshghadam.com/learning-center',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Flash Lessons',
            'url': 'https://khoshghadam.com/flash-cards',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Flash Journeys',
            'url': 'https://khoshghadam.com/flash-card-journeys',
          },
        ],
      },
    },
  ],
});


/* entries */

import EntriesGrid from '../atoms/entries-grid.vue';

</script>


<template>
  <window-base pito="address-book" title="Learning Center">
    <entries-grid
      :items="[
        {
          pito: 'address-book',
          name: 'Flash Lessons',
          to: {
            name: 'flash-cards.list',
          },
        },
        {
          pito: 'address-book',
          name: 'Flash Journeys',
          to: {
            name: 'flash-cards.flash-card-journeys.list',
          },
        },
      ]"
    />
  </window-base>
</template>
