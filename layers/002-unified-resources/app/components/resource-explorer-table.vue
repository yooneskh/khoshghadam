<script setup>

/* interface */

const props = defineProps({
  resource: String,
  actions: Array,
});


/* resource */

const itemsPerPage = ref(5);
const currentPage = ref(1);


const { data: resourcesData, pending: isResourcesLoading, refresh: refreshResources } = useUFetch(
  computed(() => `/${props.resource}`),
  {
    query: {
      'skip': computed(() => (currentPage.value - 1) * itemsPerPage.value),
      'limit': computed(() => itemsPerPage.value),
    },
  },
);

const { data: resourcesCountData, refresh: refreshResourcesCount } = useUFetch(
  computed(() => `/${props.resource}/count`),
);


const { columns } = useResourceMeta({
  resource: () => props.resource,
});


defineExpose({
  refreshResources: async () => {
    await Promise.all([
      refreshResources(),
      refreshResourcesCount(),
    ]);
  },
});

</script>


<template>
  <un-table
    :columns="columns"
    :loading="isResourcesLoading"
    :data="resourcesData"
    :total-items="resourcesCountData"
    v-model:items-per-page="itemsPerPage"
    v-model:current-page="currentPage"
    :actions="props.actions">

    <template #createdAt-cell="{ row }">
      {{ formatDate(row.original.createdAt) }}
    </template>

    <template #updatedAt-cell="{ row }">
      {{ formatDate(row.original.updatedAt) }}
    </template>

  </un-table>
</template>
