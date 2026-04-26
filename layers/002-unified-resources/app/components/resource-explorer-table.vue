<script setup>

/* interface */

const props = defineProps({
  resource: String,
  actions: Array,
});


/* resource */

import ResourceExplorerCell from '~/atoms/resource-explorer-cell.vue';


const itemsPerPage = ref(5);
const currentPage = ref(1);


const { resourcePath } = useResourceName({
  resource: () => props.resource,
});

const { columns } = useResourceMeta({
  resource: () => props.resource,
});


const { data: resourcesData, pending: isResourcesLoading, refresh: refreshResources } = useUFetch(
  computed(() => `/${resourcePath.value}`),
  {
    query: {
      'skip': computed(() => (currentPage.value - 1) * itemsPerPage.value),
      'limit': itemsPerPage,
    },
  },
);

const { data: resourcesCountData, pending: isResourcesCountLoading, refresh: refreshResourcesCount } = useUFetch(
  computed(() => `/${resourcePath.value}/count`),
);


async function refreshAll() {
  await Promise.all([
    refreshResources(),
    refreshResourcesCount(),
  ]);
}


/* outlets */

defineExpose({
  refreshResources: refreshAll,
});

</script>


<template>
  <un-table
    :columns="columns"
    :loading="isResourcesLoading || isResourcesCountLoading"
    :data="resourcesData"
    :total-items="resourcesCountData"
    v-model:items-per-page="itemsPerPage"
    v-model:current-page="currentPage"
    :actions="props.actions">

    <template v-for="column in columns" :key="column.accessorKey" #[column.accessorKey+'-cell']="{ row }">
      <resource-explorer-cell
        :column="column"
        :row="row.original"
        :data="row.original[column.accessorKey]"
        @resource:update="refreshAll()"
      />
    </template>

  </un-table>
</template>
