<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.flash-card-journeys.single',
});


/* params */

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


/* seo */

useHead({
  title: () => journeyData.value?.name,
});

useSeoMeta({
  description: () => journeyData.value?.description,
});

useJsonld(() => !journeyData.value ? null : {
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
          'name': 'Flash Card Journeys',
          'item': 'https://khoshghadam.com/flash-card-journeys',
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': journeyData.value.name,
          'item': `https://khoshghadam.com/flash-card-journeys/${journeyData.value.slug}`,
        },
      ],
    },
    {
      '@type': 'Course',
      'name': journeyData.value.name,
      'description': journeyData.value.description,
      'url': `https://khoshghadam.com/flash-card-journeys/${journeyData.value.slug}`,
      'isAccessibleForFree': true,
      'provider': {
        '@type': 'Person',
        'name': 'Yoones Khoshghadam',
      },
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'courseMode': 'online',
      },
      'offers': {
        '@type': 'Offer',
        'price': 0,
        'priceCurrency': 'USD',
      },
      'hasPart': journeyData.value.steps.map((it, index) => {
        return {
          '@type': 'LearningResource',
          'position': index + 1,
          'name': it.flashCard.name,
          'url': `https://khoshghadam.com/flash-cards/${it.flashCard.slug}`,
        };
      }),
    },
  ],
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
  <window-base pito="address-book" :title="journeyData?.name || 'Flash Card Journey'" :loading="isJourneyPending">
    <div class="p-3 space-y-3">

      <div class="flex flex-col gap-3 tablet:flex-row tablet:items-start">

        <div class="grow min-w-0">

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
            class="self-start"
          />
        </template>

        <template v-else-if="isUserAuthenticated">
          <u-badge
            variant="subtle"
            icon="lucide:route"
            class="self-start"
            :label="`${journeyData.steps.filter(it => it.completed).length} / ${journeyData.steps.length}`"
          />
        </template>

        <template v-else>
          <u-badge
            variant="subtle"
            icon="lucide:route"
            class="self-start"
            :label="`${journeyData.steps.length} steps`"
          />
        </template>

      </div>

      <template v-for="(step, index) of journeyData.steps" :key="step._id">
        <div
          class="flex items-start gap-3 p-3 border border-default rounded-xl"
          :class="{
            'opacity-50': !step.unlocked,
          }">

          <div class="size-9 shrink-0 flex items-center justify-center bg-elevated rounded-full font-semibold">
            {{ index + 1 }}
          </div>

          <div class="flex flex-col gap-3 grow min-w-0 tablet:flex-row tablet:items-center">

            <div class="grow min-w-0">

              <h2 class="font-semibold">
                {{ step.flashCard.name }}
              </h2>

              <p class="text-sm">
                {{ step.flashCard.description }}
              </p>

              <template v-if="getFlashCardSessionsFor(step.flashCard._id).length">
                <div class="space-y-2 mt-3">
                  <template v-for="session of getFlashCardSessionsFor(step.flashCard._id)" :key="session._id">
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1">

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

            <div class="flex items-center gap-2 tablet:shrink-0 tablet:flex-col">

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

        </div>
      </template>

    </div>
  </window-base>
</template>
