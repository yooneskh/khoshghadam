<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.single',
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
      'populate': 'owner:name,category:name',
    },
  },
);


useHead({
  title: () => flashCardData.value?.name,
});


/* sessions */

const { data: sessionsData } = useUFetch(
  '/api/flash-card-sessions/mine',
  {
    enabled: useIsUserAuthenticated(),
  },
);

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

    <template v-if="sessionsData?.length">
      <div class="p-3 border-t border-default">

        <p>
          Your past sessions
        </p>

        <div class="mt-3 space-y-3">
          <template v-for="session of sessionsData" :key="session._id">
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
