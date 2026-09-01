<script setup>

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

const { data: sessionsData } = useUFetch(
  '/api/flash-card-sessions/mine',
  {
    enabled: useIsUserAuthenticated(),
  },
);


const flashCardSessions = computed(() => {

  if (!flashCardData.value || !sessionsData.value) {
    return [];
  }


  return sessionsData.value.filter(it => it.flashCard === flashCardData.value._id);

});

</script>


<template>
  <window-base
    pito="address-book"
    :title="`${flashCardData?.name || '-'}`"
    :loading="isFlashCardPending"
    :actions="[
      {
        icon: 'lucide:play',
        label: 'Start Learning',
        to: {
          name: 'flash-cards.single.learn',
          params: {
            flashCardSlug: flashCardSlug,
          },
        },
      },
    ]">

    <div class="p-3">
      <h1 class="text-2xl font-semibold">
        {{ flashCardData?.name }}
      </h1>
      <h2 class="mt-1">
        {{ flashCardData?.category?.name }} - by {{ flashCardData?.owner?.name }}
      </h2>
      <div class="flex items-center gap-3 mt-2">
        <template v-for="tag of flashCardData?.tags" :key="tag">
          <u-badge
            variant="subtle"
            :label="tag"
          />
        </template>
      </div>
      <p class="mt-4">
        {{ flashCardData?.description }}
      </p>
    </div>

    <template v-if="flashCardSessions.length">
      <div class="p-3 border-t border-default">

        <p>
          Your past sessions
        </p>

        <div class="mt-3 space-y-3">
          <template v-for="session of flashCardSessions" :key="session._id">
            <div class="flex items-center gap-3">
              <div class="flex flex-wrap items-center gap-1">
                <template v-for="answer of session.answeredCards" :key="answer._id">
                  <u-tooltip :text="flashCardData?.cards?.find(it => it._id === answer.card)?.frontText">
                    <u-badge
                      variant="subtle"
                      :color="answer.opened ? 'warning' : 'success'"
                      class="size-3"
                    />
                  </u-tooltip>
                </template>
              </div>
              <div class="grow" />
              <span class="text-xs tabular-nums">
                {{ formatDate(session.createdAt) }}
              </span>
            </div>
          </template>
        </div>

      </div>
    </template>

  </window-base>
</template>
