<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.single.learn',
});


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
    },
  },
);


useHead({
  title: () => `${flashCardData.value?.name} Cards`,
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
    flashCardData.value.cards.map(it => [
      it._id,
      previousSessionsData.value
        .filter(i => i.flashCard === flashCardData.value._id)
        .map(i => ({
          opened: i.answeredCards.find(x => x.card === it._id)?.opened,
          createdAt: i.createdAt,
        }))
        .filter(i => i.opened !== undefined),
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
        variant: 'subtle',
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
                'rotate-y-180': index === rotatedIndex
              }">

              <div class="absolute w-full h-full flex flex-col items-center justify-center bg-elevated border border-default rounded-xl backface-hidden" @click="rotatedIndex = index;">
                <div class="text-2xl font-medium">
                  {{ card.frontText }}
                </div>
                <template v-if="cardsSessions?.[card._id]">
                  <div class="flex flex-wrap items-center gap-1 mt-1">
                    <template v-for="(answer, index) of cardsSessions[card._id]" :key="index">
                      <u-tooltip :text="formatDate(answer.createdAt)">
                        <u-badge
                          variant="subtle"
                          :color="answer.opened === true ? 'warning' : answer.opened === false ? 'success' : undefined"
                        />
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
