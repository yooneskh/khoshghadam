<script setup>

/* responsibility */

// Renders a group of resource statistics
// with their values and labels.


/* interface */

const props = defineProps({
  statistics: Array,
  layout: String,
  title: String,
  columns: Number,
  refreshInterval: Number,
});

const emit = defineEmits([
  'loaded',
  'error',
]);


/* statistics */

import ResourceStatisticTile from '../atoms/resource-statistic-tile.vue';
import { useResourceStatistics } from '../libs/use-resource-statistics';


const { results, isStatisticsPending, refresh } = useResourceStatistics({
  statistics: () => props.statistics,
  onLoaded: handleLoaded,
  onError: handleError,
});


/* actions */

const actions = computed(() => {
  return [
    {
      variant: 'subtle',
      icon: 'lucide:refresh-ccw',
      onClick: refresh,
    },
  ];
});


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


/* refresh */

const { pause: pauseRefresh, resume: resumeRefresh } = useIntervalFn(refresh, computed(() => props.refreshInterval ?? 0), {
  immediate: false,
});


watchImmediate(
  () => props.refreshInterval,
  handleRefreshIntervalChange,
);


/* events */

function handleLoaded(statistics) {
  emit('loaded', statistics);
}

function handleError(statistics) {
  emit('error', statistics);
}

function handleRefreshIntervalChange(interval) {
  if (interval) {
    resumeRefresh();
  }
  else {
    pauseRefresh();
  }
}


/* outlets */

defineExpose({
  refresh,
});

</script>


<template>

  <template v-if="props.title">
    <un-card :title="props.title" :append-actions="actions" :aria-busy="isStatisticsPending">
      <div :class="layoutClasses">
        <template v-for="(statistic, index) of results" :key="index">
          <resource-statistic-tile
            :statistic="statistic"
            :layout="props.layout"
          />
        </template>
      </div>
    </un-card>
  </template>

  <template v-else>
    <div :class="layoutClasses" :aria-busy="isStatisticsPending">
      <template v-for="(statistic, index) of results" :key="index">
        <resource-statistic-tile
          :statistic="statistic"
          :layout="props.layout"
        />
      </template>
    </div>
  </template>

</template>
