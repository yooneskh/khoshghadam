<script setup>

/* responsibility */

// Lists the signed-in user's past sessions
// on one flash card deck.


/* interface */

const props = defineProps({
  flashCard: Object,
});


/* sessions */

const { data: sessionsData } = useUFetch(
  '/api/flash-card-sessions/mine',
  {
    enabled: useIsUserAuthenticated(),
  },
);


const flashCardSessions = computed(() => {

  if (!props.flashCard || !sessionsData.value) {
    return [];
  }


  return sessionsData.value.filter(it => it.flashCard === props.flashCard._id);

});

</script>


<template>
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
                <u-tooltip :text="props.flashCard?.cards?.find(it => it._id === answer.card)?.frontText">
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
</template>
