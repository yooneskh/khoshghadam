<script setup>

/* interface */

const props = defineProps({
  resource: String,
  actions: Array,
});


/* resource */

import ResourceExplorerCell from '~/atoms/resource-explorer-cell.vue';


const itemsPerPage = ref(20);
const currentPage = ref(1);
const tickle = ref(0);

const sortedColumn = ref('createdAt');
const sortDirection = ref('desc');


const { resourcePath } = useResourceName({
  resource: () => props.resource,
});

const { columns } = useResourceMeta({
  resource: () => props.resource,
});


const sort = computed(() => {
  if (!sortedColumn.value || !sortDirection.value) {
    return undefined;
  }
  else {
    return `${sortedColumn.value}:${sortDirection.value}`;
  }
});


const { data: resourcesData, pending: isResourcesPending, refresh: refreshResources } = useUFetch(
  computed(() => `/api/${resourcePath.value}`),
  {
    query: {
      'sort': sort,
      'skip': computed(() => (currentPage.value - 1) * itemsPerPage.value),
      'limit': itemsPerPage,
    },
  },
);

const { data: resourcesCountData, pending: isResourcesCountPending, refresh: refreshResourcesCount } = useUFetch(
  computed(() => `/api/${resourcePath.value}/count`),
);


function handleSort(column) {

  currentPage.value = 1;


  if (sortedColumn.value !== column) {
    sortedColumn.value = column;
    sortDirection.value = 'desc';
  }
  else if (sortDirection.value === 'desc') {
    sortDirection.value = 'asc';
  }
  else {
    sortedColumn.value = undefined;
    sortDirection.value = undefined;
  }

}

function getSortIcon(column) {
  if (sortedColumn.value !== column) {
    return 'lucide:arrow-up-down';
  }
  else {
    return sortDirection.value === 'desc' ? 'lucide:arrow-down' : 'lucide:arrow-up';
  }
}

function getSortLabel(column) {
  if (sortedColumn.value !== column) {
    return `Sort ${column} descending`;
  }
  else if (sortDirection.value === 'desc') {
    return `Sort ${column} ascending`;
  }
  else {
    return `Clear ${column} sorting`;
  }
}


async function refreshAll() {

  tickle.value++;

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
    :loading="isResourcesPending || isResourcesCountPending"
    :data="resourcesData"
    :total-items="resourcesCountData"
    v-model:items-per-page="itemsPerPage"
    v-model:current-page="currentPage"
    :actions="props.actions">

    <template v-for="column in columns" :key="column.accessorKey" #[column.accessorKey+'-header']>
      <div class="flex items-center gap-1">
        <span>
          {{ column.header }}
        </span>
        <u-button
          variant="subtle"
          size="xs"
          :icon="getSortIcon(column.accessorKey)"
          :aria-label="getSortLabel(column.accessorKey)"
          @click="handleSort(column.accessorKey)"
        />
      </div>
    </template>

    <template v-for="column in columns" :key="column.accessorKey" #[column.accessorKey+'-cell']="{ row }">
      <resource-explorer-cell
        :key="tickle"
        :column="column"
        :row="row.original"
        :data="row.original[column.accessorKey]"
        @resource:update="refreshAll()"
      />
    </template>

  </un-table>
</template>
