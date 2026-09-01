<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.flash-card-journeys.list',
});


/* journeys */

const isUserAuthenticated = useIsUserAuthenticated();


const { data: availableJourneysData, pending: isAvailableJourneysPending } = useUFetch(
  '/api/flash-card-journeys/available',
);

const { data: journeyStatesData, pending: isJourneyStatesPending } = useUFetch(
  '/api/flash-card-journeys/mine',
  {
    enabled: isUserAuthenticated,
  },
);


const journeysData = computed(() => {
  return isUserAuthenticated.value ? journeyStatesData.value : availableJourneysData.value;
});

const isJourneysPending = computed(() => {
  return isAvailableJourneysPending.value || (isUserAuthenticated.value && isJourneyStatesPending.value);
});


/* seo */

useHead({
  title: 'Flash Card Journeys',
});

useSeoMeta({
  description: 'Follow structured flash card journeys to learn step by step.',
});

useJsonld(() => !journeysData.value ? null : {
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
      ],
    },
    {
      '@type': 'CollectionPage',
      'name': 'Flash Card Journeys',
      'description': 'Follow structured flash card journeys to learn step by step.',
      'url': 'https://khoshghadam.com/flash-card-journeys',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': journeysData.value.map((it, index) => {
          return {
            '@type': 'ListItem',
            'position': index + 1,
            'name': it.name,
            'url': `https://khoshghadam.com/flash-card-journeys/${it.slug}`,
          };
        }),
      },
    },
  ],
});

</script>


<template>
  <window-base
    pito="address-book"
    title="Flash Card Journeys"
    :loading="isJourneysPending">
    <div class="p-3">

      <template v-if="journeysData?.length">
        <div class="grid gap-3 tablet:grid-cols-2">
          <template v-for="journey of journeysData" :key="journey._id">
            <nuxt-link
              class="p-4 border border-default rounded-xl hover:bg-elevated"
              :to="{
                name: 'flash-cards.flash-card-journeys.single',
                params: {
                  journeySlug: journey.slug,
                },
              }">
              <div class="flex items-start gap-3">

                <div class="grow">
                  <h2 class="font-semibold">
                    {{ journey.name }}
                  </h2>
                  <p class="text-sm mt-1">
                    {{ journey.description }}
                  </p>
                </div>

                <template v-if="isUserAuthenticated && journey.completed">
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
                    :label="`${journey.steps.filter(it => it.completed).length} / ${journey.steps.length}`"
                  />
                </template>
                <template v-else>
                  <u-badge
                    variant="subtle"
                    icon="lucide:route"
                    :label="`${journey.steps.length} steps`"
                  />
                </template>

              </div>
            </nuxt-link>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="h-full flex flex-col items-center justify-center py-12 text-center">
          <u-icon
            name="lucide:route"
            class="size-10 text-muted"
          />
          <p class="mt-3 text-muted">
            No flash card journeys are available yet.
          </p>
        </div>
      </template>

    </div>
  </window-base>
</template>
