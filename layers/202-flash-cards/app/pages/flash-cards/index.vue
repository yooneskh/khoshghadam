<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.list',
});


/* flash cards */

const { data: flashCardsData, pending: isFlashCardsPending } = useUFetch(
  '/api/flash-cards',
);


/* seo */

useHead({
  title: 'Flash Cards',
});

useSeoMeta({
  description: 'Browse free flash card decks for practice and study.',
});

useJsonld(() => !flashCardsData.value ? null : {
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
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Flash Cards',
          'item': 'https://khoshghadam.com/flash-cards',
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      'name': 'Flash Cards',
      'description': 'Browse free flash card decks for practice and study.',
      'url': 'https://khoshghadam.com/flash-cards',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': flashCardsData.value.map((it, index) => {
          return {
            '@type': 'ListItem',
            'position': index + 1,
            'name': it.name,
            'url': `https://khoshghadam.com/flash-cards/${it.slug}`,
          };
        }),
      },
    },
  ],
});

</script>


<template>
  <window-base pito="address-book" title="Flash Cards" :loading="isFlashCardsPending">
    <entries-table
      :items="flashCardsData?.map(it => ({
        pito: 'folder-opened',
        name: it.name,
        to: {
          name: 'flash-cards.single',
          params: {
            flashCardSlug: it.slug,
          },
        },
      }))"
    />
  </window-base>
</template>
