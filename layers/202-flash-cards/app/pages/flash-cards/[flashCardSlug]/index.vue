<script setup>

/* responsibility */

// Shows one flash card deck
// with its details and past sessions.


/* page */

definePageMeta({
  name: 'flash-cards.single',
});


/* params */

const route = useRoute();


const flashCardSlug = computed(() => {
  return route.params.flashCardSlug;
});


/* flash cards */

const { data: flashCardData, pending: isFlashCardPending } = useUFetch(
  '/api/flash-cards',
  {
    query: {
      'filter': computed(() => `slug:eq:${flashCardSlug.value}`),
      'single': 'xtruex',
      'populate': 'owner:name,category:name',
    },
  },
);


/* seo */

useHead({
  title: () => flashCardData.value?.name,
});

useSeoMeta({
  description: () => flashCardData.value?.description,
});

useJsonld(() => !flashCardData.value ? null : {
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
        {
          '@type': 'ListItem',
          'position': 3,
          'name': flashCardData.value.name,
          'item': `https://khoshghadam.com/flash-cards/${flashCardData.value.slug}`,
        },
      ],
    },
    {
      '@type': 'LearningResource',
      'name': flashCardData.value.name,
      'description': flashCardData.value.description,
      'url': `https://khoshghadam.com/flash-cards/${flashCardData.value.slug}`,
      'learningResourceType': 'Flash cards',
      'isAccessibleForFree': true,
      'author': {
        '@type': 'Person',
        'name': flashCardData.value.owner?.name || 'Yoones Khoshghadam',
      },
      'hasPart': flashCardData.value.cards.map(it => {
        return {
          '@type': 'Question',
          'name': it.frontText,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': it.backText,
          },
        };
      }),
    },
  ],
});


/* sessions */

import FlashCardPastSessions from '../../../atoms/flash-card-past-sessions.vue';

</script>


<template>
  <window-base
    pito="address-book"
    :title="flashCardData?.name || '-'"
    :loading="isFlashCardPending"
    :actions="[
      {
        variant: 'subtle',
        icon: 'lucide:play',
        label: 'Start Learning',
        to: {
          name: 'flash-cards.single.learn',
          params: {
            flashCardSlug,
          },
        },
      },
    ]">

    <div class="p-3">

      <h1 class="text-2xl font-semibold">
        {{ flashCardData?.name }}
      </h1>

      <h2 class="mt-1 text-sm">
        {{ flashCardData?.category?.name }} - by {{ flashCardData?.owner?.name }}
      </h2>

      <div class="flex items-center gap-3 mt-2">
        <template v-for="tag of flashCardData?.tags" :key="tag">
          <u-badge
            variant="subtle"
            icon="lucide:tag"
            :label="tag"
          />
        </template>
      </div>

      <p class="mt-4">
        {{ flashCardData?.description }}
      </p>

    </div>

    <flash-card-past-sessions :flash-card="flashCardData" />

  </window-base>
</template>
