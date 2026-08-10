<script setup>

/* interface */

const props = defineProps({
  column: Object,
  row: Object,
  data: {},
});

const emit = defineEmits([
  'resource:update',
]);


/* resource */

import ResourceExplorerCellRef from '~/atoms/resource-explorer-cell-ref.vue';


async function handleViewItems() {
  launchTableDialog({
    icon: 'lucide:list',
    title: 'View Items',
    subtitle: 'View items of this field',
    columns: props.column.items.properties.map(it => ({
      accessorKey: it.key,
      header: radTitle(it.key),
    })),
    data: props.data,
  });
}

</script>


<template>

  <template v-if="props.column.resource">
    <div class="flex flex-wrap gap-2">
      <template v-for="item of radCastArray(props.data || [])" :key="item">
        <resource-explorer-cell-ref
          :column="props.column"
          :row="props.row"
          :data="item"
          @resource:update="emit('resource:update')"
        />
      </template>
    </div>
  </template>

  <template v-else-if="props.column.type === 'array' && props.column.items.type === 'string'">
    <div class="max-w-xs flex flex-wrap gap-1">
      <template v-for="item of props.data || []">
        <u-badge
          variant="subtle"
          :label="item"
        />
      </template>
    </div>
  </template>

  <template v-else-if="props.column.type === 'array' && props.column.items.type === 'object'">
    <a
      class="text-primary underline cursor-pointer"
      @click="handleViewItems()">
      View {{ props.column?.header || 'Items' }}
    </a>
  </template>

  <template v-else-if="props.column.type === 'date' || props.column.labelFormat">
    {{ formatDate(props.data, props.column.labelFormat === 'default' ? undefined : props.column.labelFormat) }}
  </template>

  <template v-else-if="props.data === true || props.data === false">
    <template v-if="props.data">
      <u-badge
        variant="subtle"
        color="success"
        icon="lucide:check"
      />
    </template>
    <template v-else>
      <u-badge
        variant="subtle"
        color="error"
        icon="lucide:x"
      />
    </template>
  </template>

  <template v-else-if="props.column.enum">
      <u-badge
        variant="subtle"
        :label="props.column.enum?.find(it => it.value === props.data)?.label ?? props.data"
      />
  </template>

  <template v-else>
    {{ props.data }}
  </template>

</template>
