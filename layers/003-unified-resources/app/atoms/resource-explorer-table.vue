<script setup>

/* interface */

const props = defineProps({
  resource: String,
  actions: Array,
});


/* resource */

import ResourceExplorerCell from './resource-explorer-cell.vue';
import ResourceExplorerColumnFilter from './resource-explorer-column-filter.vue';
import { useResourceName } from '../libs/use-resource-name';
import { useResourceMeta } from '../libs/use-resource-meta';


const itemsPerPage = ref(20);
const currentPage = ref(1);
const tickle = ref(0);

const sortedColumn = ref('createdAt');
const sortDirection = ref('desc');
const filters = ref({});


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

const filter = computed(() => {
  return (
    Object.entries(filters.value)
      .map(([key, item]) => `${key}:${item.operator}:${item.value ?? ''}`)
      .join(',')
  );
});

const activeFilters = computed(() => {
  return (
    Object.entries(filters.value)
      .map(([key, item]) => ({
        key,
        column: columns.value.find(it => it.accessorKey === key),
        filter: item,
      }))
      .filter(it => !!it.column)
  );
});


const { data: resourcesData, pending: isResourcesPending, refresh: refreshResources } = useUFetch(
  computed(() => `/api/${resourcePath.value}`),
  {
    query: {
      'filter': filter,
      'sort': sort,
      'skip': computed(() => (currentPage.value - 1) * itemsPerPage.value),
      'limit': itemsPerPage,
    },
  },
);

const { data: resourcesCountData, pending: isResourcesCountPending, refresh: refreshResourcesCount } = useUFetch(
  computed(() => `/api/${resourcePath.value}/count`),
  {
    query: {
      'filter': filter,
    },
  },
);


watch(resourcePath, () => {
  filters.value = {};
  currentPage.value = 1;
});


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

function handleFilterApply(column, value) {

  filters.value = {
    ...filters.value,
    [column]: value,
  };

  currentPage.value = 1;

}

function handleFilterClear(column) {

  const nextFilters = {
    ...filters.value,
  };

  delete nextFilters[column];

  filters.value = nextFilters;
  currentPage.value = 1;

}

function handleFiltersClear() {
  filters.value = {};
  currentPage.value = 1;
}

function getSortIcon(column) {
  if (sortedColumn.value !== column) {
    return 'lucide:arrow-up-down';
  }
  else {
    return sortDirection.value === 'desc' ? 'lucide:arrow-down' : 'lucide:arrow-up';
  }
}

function getSortVariant(column) {
  if (sortedColumn.value !== column) {
    return 'ghost';
  }
  else {
    return undefined;
  }
}

function getSortColor(column) {
  if (sortedColumn.value !== column) {
    return undefined;
  }
  else {
    return 'primary';
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

function getFilterLabel(item) {

  const { column, filter } = item;
  const operator = filter.operatorLabel?.toLowerCase() || filter.operator;

  if (['empty', 'not-empty', 'empty-object', 'not-empty-object'].includes(filter.operator)) {
    return `${column.header} ${operator}`;
  }
  else if (column.type === 'date' || column.labelFormat) {
    return `${column.header} ${operator} ${new Date(filter.value).toLocaleDateString()}`;
  }
  else if (filter.displayValue === true || filter.displayValue === false) {
    return `${column.header} ${operator} ${filter.displayValue ? 'True' : 'False'}`;
  }
  else {
    return `${column.header} ${operator} ${filter.displayValue}`;
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
  <div>

    <div class="flex flex-wrap items-center gap-2 border-b border-default p-3">
      <span class="text-sm text-muted">
        Filters
      </span>

      <template v-if="activeFilters.length">

        <template v-for="item in activeFilters" :key="item.key">
          <u-button
            variant="subtle"
            size="xs"
            :label="getFilterLabel(item)"
            trailing-icon="lucide:x"
            :aria-label="`Clear ${item.column.header} filter`"
            @click="handleFilterClear(item.key)"
          />
        </template>

        <u-button
          variant="ghost"
          size="xs"
          label="Clear all"
          @click="handleFiltersClear()"
        />

      </template>
      <template v-else>
        <span class="text-sm text-dimmed">
          empty
        </span>
      </template>

    </div>

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
            :variant="getSortVariant(column.accessorKey)"
            :color="getSortColor(column.accessorKey)"
            size="xs"
            :icon="getSortIcon(column.accessorKey)"
            :aria-label="getSortLabel(column.accessorKey)"
            @click="handleSort(column.accessorKey)"
          />
          <resource-explorer-column-filter
            :column="column"
            :filter="filters[column.accessorKey]"
            @apply="handleFilterApply(column.accessorKey, $event)"
            @clear="handleFilterClear(column.accessorKey)"
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

  </div>
</template>
