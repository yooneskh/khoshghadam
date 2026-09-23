<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.single.learn',
});


/* params */

const route = useRoute();


const flashCardSlug = computed(() => {
  return route.params.flashCardSlug;
});

const journeySlug = computed(() => {
  return route.query.journey;
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
  title: () => `${flashCardData.value?.name} Cards`,
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
        {
          '@type': 'ListItem',
          'position': 4,
          'name': 'Learn',
          'item': `https://khoshghadam.com/flash-cards/${flashCardData.value.slug}/learn`,
        },
      ],
    },
    {
      '@type': 'LearningResource',
      'name': `${flashCardData.value.name} Cards`,
      'description': flashCardData.value.description,
      'url': `https://khoshghadam.com/flash-cards/${flashCardData.value.slug}/learn`,
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


/* cards */

const activeIndex = ref(0);
const rotatedIndex = ref(-1);


/* session */

const isUserAuthenticated = useIsUserAuthenticated();
const answeredCards = ref([]);


const { data: previousSessionsData } = useUFetch(
  '/api/flash-card-sessions/mine',
  {
    enabled: isUserAuthenticated,
  },
);


const cardsSessions = computed(() => {

  if (!flashCardData.value || !previousSessionsData.value) {
    return;
  }


  return Object.fromEntries(
    flashCardData.value.cards.map(card => [
      card._id,
      previousSessionsData.value
        .filter(session => session.flashCard === flashCardData.value._id)
        .map(session => ({
          opened: session.answeredCards.find(it => it.card === card._id)?.opened,
          createdAt: session.createdAt,
        }))
        .filter(answer => answer.opened !== undefined)
        .toReversed(),
    ]),
  );

});


async function handleCardAdvance() {

  const currentCard = flashCardData.value.cards[activeIndex.value];

  answeredCards.value = [
    ...answeredCards.value.filter(it => it.card !== currentCard._id),
    {
      card: currentCard._id,
      opened: rotatedIndex.value === activeIndex.value,
    },
  ];


  if (activeIndex.value < flashCardData.value.cards.length - 1) {
    activeIndex.value += 1;
    return;
  }


  if (isUserAuthenticated.value) {
    await ufetch('/api/flash-card-sessions/mine', {
      method: 'post',
      body: {
        flashCard: flashCardData.value._id,
        answeredCards: answeredCards.value,
      },
    });
  }


  makeConfetti({
    template: 'split-on-top',
  });


  if (journeySlug.value) {
    await navigateTo({
      name: 'flash-cards.flash-card-journeys.single',
      params: {
        journeySlug: journeySlug.value,
      },
    });
  }
  else {
    await navigateTo({
      name: 'flash-cards.single',
      params: {
        flashCardSlug: flashCardSlug.value,
      },
    });
  }

}

</script>


<template>
  <window-base
    pito="address-book"
    :title="`${flashCardData?.name || '-'} Cards`"
    :loading="isFlashCardPending"
    :actions="[
      {
        label: activeIndex < flashCardData?.cards.length - 1 ? 'Next' : 'Finish',
        onClick: handleCardAdvance,
      },
    ]">
    <div class="h-full w-full flex items-center justify-center">
      <div class="w-full flex flex-col items-center gap-3 relative overflow-hidden p-3">

        <template v-for="(card, index) of flashCardData.cards" :key="card._id">
          <div
            class="w-64 h-72 absolute flex items-center justify-center transition-all duration-1000 perspective-distant"
            :class="{
              'left-0 -translate-x-full': index < activeIndex,
              'left-1/2 -translate-x-1/2': index === activeIndex,
              'left-full translate-x-0': index > activeIndex,
            }">
            <div
              class="relative w-full h-full transition-transform duration-1000 transform-3d"
              :class="{
                'rotate-y-180': index === rotatedIndex,
              }">

              <div class="absolute w-full h-full flex flex-col items-center justify-center bg-elevated border border-default rounded-xl backface-hidden" @click="rotatedIndex = index;">

                <div class="text-2xl font-medium">
                  {{ card.frontText }}
                </div>

                <template v-if="cardsSessions?.[card._id]">
                  <div class="flex flex-wrap items-center gap-1 mt-1">
                    <template v-for="(answer, answerIndex) of cardsSessions[card._id]" :key="answerIndex">
                      <u-tooltip :text="formatDate(answer.createdAt)">

                        <template v-if="answer.opened === true">
                          <u-badge
                            variant="subtle"
                            color="warning"
                          />
                        </template>

                        <template v-else-if="answer.opened === false">
                          <u-badge
                            variant="subtle"
                            color="success"
                          />
                        </template>

                        <template v-else>
                          <u-badge variant="subtle" />
                        </template>

                      </u-tooltip>
                    </template>
                  </div>
                </template>

              </div>

              <div class="absolute w-full h-full flex items-center justify-center bg-accented border border-default rounded-xl backface-hidden rotate-y-180">
                <span class="text-center">
                  {{ card.backText }}
                </span>
              </div>

            </div>
          </div>
        </template>

        <div class="w-64 h-72" />

      </div>
    </div>
  </window-base>
</template>
