<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.single.learn',
});


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
    },
  },
);


useSeoMeta({
  title: () => `${flashCardData.value?.name} Cards`,
  description: () => flashCardData.value?.description,
});


/* cards */

const activeIndex = ref(0);
const rotatedIndex = ref(-1);


/* session */

const user = useUser();
const flashCardSession = ref();


watchImmediate([user, flashCardData], async () => {

  if (!user.value || !flashCardData.value) {
    return;
  }


  flashCardSession.value = await ufetch('/api/flash-card-sessions', {
    method: 'post',
    body: {
      flashCard: flashCardData.value._id,
      user: user.value._id,
      answeredCards: [],
    },
  });

});


async function handleCardAdvance() {

  if (flashCardSession.value) {
    flashCardSession.value = await ufetch(`/api/flash-card-sessions/${flashCardSession.value._id}`, {
      method: 'patch',
      body: {
        answeredCards: [
          ...flashCardSession.value.answeredCards,
          {
            card: flashCardData.value.cards[activeIndex.value]._id,
            opened: rotatedIndex.value === activeIndex.value,
          },
        ],
      },
    });
  }


  if (activeIndex.value < flashCardData.value.cards.length - 1) {
    activeIndex.value += 1;
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
              <div class="absolute w-full h-full flex items-center justify-center bg-elevated border border-default rounded-xl backface-hidden" @click="rotatedIndex = index;">
                <span class="text-2xl font-medium">
                  {{ card.frontText }}
                </span>
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
