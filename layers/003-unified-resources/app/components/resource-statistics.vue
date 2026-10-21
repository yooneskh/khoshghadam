<script setup>

/* responsibility */

// Renders a group of resource statistics
// with their values and labels.


/* interface */

const props = defineProps({
  statistics: Array,
  layout: String,
  columns: Number,
});


/* statistics */

import ResourceStatisticTile from '../atoms/resource-statistic-tile.vue';
import { serializeResourceStatisticFilters } from '../libs/serialize-resource-statistic-filters';


const statistics = computed(() => {
  return props.statistics || [];
});

const statisticFetches = statistics.value.map((statistic) => {
  return useUFetch(
    () => `/api/${resolveResourcePath(statistic.resource)}/count`,
    {
      query: {
        'filter': computed(() => serializeResourceStatisticFilters(statistic.filters)),
      },
    },
  );
});

const results = computed(() => {
  return statistics.value.map((config, index) => {
    return {
      config,
      value: statisticFetches[index].data.value == null ? undefined : Number(statisticFetches[index].data.value),
      error: !!statisticFetches[index].error.value,
    };
  });
});

const isStatisticsPending = computed(() => {
  return statisticFetches.some(it => it.pending.value);
});


async function refresh() {
  await Promise.all(statisticFetches.map(it => it.refresh()));
}


/* layout */

const layoutClasses = computed(() => {
  if (props.layout === 'chips') {
    return 'flex flex-wrap items-center gap-2';
  }
  else {
    return [
      'grid gap-3 sm:grid-cols-2',
      {
        'lg:grid-cols-2': props.columns === 2,
        'lg:grid-cols-3': props.columns === 3,
        'lg:grid-cols-4': !props.columns || props.columns === 4,
        'lg:grid-cols-5': props.columns === 5,
        'lg:grid-cols-6': props.columns === 6,
      },
    ];
  }
});


/* outlets */

defineExpose({
  refresh,
});

</script>


<template>
  <div :class="layoutClasses" :aria-busy="isStatisticsPending">
    <template v-for="(statistic, index) of results" :key="index">
      <resource-statistic-tile
        :statistic="statistic"
        :layout="props.layout"
      />
    </template>
  </div>
</template>
