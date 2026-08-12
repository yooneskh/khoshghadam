<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.flash-card-journeys.single',
});


const route = useRoute();

const journeySlug = computed(() => {
  return route.params.journeySlug;
});


/* journey */

const isUserAuthenticated = useIsUserAuthenticated();


const { data: availableJourneyData, pending: isAvailableJourneyPending } = useUFetch(
  computed(() => `/api/flash-card-journeys/available/${journeySlug.value}`),
);

const { data: journeyStateData, pending: isJourneyStatePending } = useUFetch(
  computed(() => `/api/flash-card-journeys/mine/${journeySlug.value}`),
  {
    enabled: isUserAuthenticated,
  },
);


const journeyData = computed(() => {
  return isUserAuthenticated.value ? journeyStateData.value : availableJourneyData.value;
});

const isJourneyPending = computed(() => {
  return isAvailableJourneyPending.value || (isUserAuthenticated.value && isJourneyStatePending.value);
});


useHead({
  title: () => journeyData.value?.name,
});


/* sessions */

const { data: sessionsData } = useUFetch(
  '/api/flash-card-sessions/mine',
  {
    enabled: isUserAuthenticated,
  },
);


function getFlashCardSessionsFor(flashCardId) {
  return sessionsData.value?.filter(it => it.flashCard === flashCardId) ?? [];
}

</script>


<template>
  <window-base
    pito="address-book"
    :title="journeyData?.name || 'Flash Card Journey'"
    :loading="isJourneyPending">
    <div class="p-3 space-y-3">

      <div class="flex items-start gap-3">

        <div class="grow">
          <h1 class="text-2xl font-semibold">
            {{ journeyData.name }}
          </h1>
          <p class="text-muted mt-1">
            {{ journeyData.description }}
          </p>
        </div>

        <template v-if="isUserAuthenticated && journeyData.completed">
          <u-badge
            variant="subtle"
            color="success"
            icon="lucide:circle-check"
            label="Completed"
          />
        </template>
        <template v-else-if="isUserAuthenticated">
          <u-badge
            variant="subtle"
            icon="lucide:route"
            :label="`${journeyData.steps.filter(it => it.completed).length} / ${journeyData.steps.length}`"
          />
        </template>
        <template v-else>
          <u-badge
            variant="subtle"
            icon="lucide:route"
            :label="`${journeyData.steps.length} steps`"
          />
        </template>

      </div>

      <template v-for="(step, index) of journeyData.steps" :key="step._id">
        <div
          class="flex items-center gap-3 p-3 border border-default rounded-xl"
          :class="{
            'opacity-50': !step.unlocked,
          }">

          <div class="size-9 shrink-0 flex items-center justify-center bg-elevated rounded-full font-semibold">
            {{ index + 1 }}
          </div>

          <div class="grow">

            <h2 class="font-semibold">
              {{ step.flashCard.name }}
            </h2>

            <p class="text-sm">
              {{ step.flashCard.description }}
            </p>

            <template v-if="getFlashCardSessionsFor(step.flashCard._id).length">
              <div class="space-y-2 mt-3">
                <template v-for="session of getFlashCardSessionsFor(step.flashCard._id)" :key="session._id">
                  <div class="flex items-center gap-3">

                    <div class="flex flex-wrap items-center gap-1">
                      <template v-for="answer of session.answeredCards" :key="answer._id">
                        <u-tooltip :text="step.flashCard.cards.find(it => it._id === answer.card)?.frontText">
                          <u-badge
                            variant="subtle"
                            :color="answer.opened ? 'warning' : 'success'"
                            class="size-3"
                          />
                        </u-tooltip>
                      </template>
                    </div>

                    <span class="text-xs tabular-nums">
                      {{ formatDate(session.createdAt) }}
                    </span>

                  </div>
                </template>
              </div>
            </template>

          </div>

          <div class="flex flex-col items-center gap-2">

            <template v-if="step.unlocked">
              <template v-if="!isUserAuthenticated">
                <u-button
                  variant="subtle"
                  icon="lucide:log-in"
                  label="Login to Start"
                  :to="{
                    name: 'authentication.login',
                    query: {
                      returnUrl: route.fullPath,
                    },
                  }"
                />
              </template>
              <template v-else-if="step.completed">
                <u-button
                  variant="subtle"
                  icon="lucide:rotate-ccw"
                  label="Practice Again"
                  :to="{
                    name: 'flash-cards.single.learn',
                    params: {
                      flashCardSlug: step.flashCard.slug,
                    },
                    query: {
                      journey: journeyData.slug,
                    },
                  }"
                />
              </template>
              <template v-else>
                <u-button
                  variant="subtle"
                  icon="lucide:play"
                  label="Start"
                  :to="{
                    name: 'flash-cards.single.learn',
                    params: {
                      flashCardSlug: step.flashCard.slug,
                    },
                    query: {
                      journey: journeyData.slug,
                    },
                  }"
                />
              </template>
            </template>

            <template v-if="step.completed">
              <u-badge
                variant="subtle"
                color="success"
                icon="lucide:circle-check"
                label="Completed"
              />
            </template>
            <template v-else-if="!step.unlocked">
              <u-badge
                variant="subtle"
                icon="lucide:lock"
                label="Locked"
              />
            </template>

          </div>

        </div>
      </template>

    </div>
  </window-base>
</template>
