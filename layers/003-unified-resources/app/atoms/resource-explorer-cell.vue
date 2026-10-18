<script setup>

/* responsibility */

// Renders one resource field value
// inside a resource explorer table cell.


/* interface */

const props = defineProps({
  column: Object,
  row: Object,
  data: [
    String,
    Number,
    Boolean,
    Object,
    Array,
  ],
});

const emit = defineEmits([
  'resource:update',
]);


/* resource */

import ResourceExplorerCellRef from './resource-explorer-cell-ref.vue';
import { launchTableDialog } from '../libs/launch-table-dialog';


async function handleViewItems() {
  await launchTableDialog({
    icon: 'lucide:list',
    title: 'View Items',
    subtitle: 'View items of this field',
    columns: props.column.items.properties.map(it => ({
      accessorKey: it.key,
      header: radTitle(it.key),
      resource: it.resource,
      type: it.type,
      items: it.items,
      enum: it.enum,
      labelFormat: it.labelFormat,
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
      <template v-for="(item, index) of props.data || []" :key="`${item}-${index}`">
        <u-badge
          variant="subtle"
          :label="item"
        />
      </template>
    </div>
  </template>

  <template v-else-if="props.column.type === 'array' && props.column.items.type === 'object'">
    <a class="text-primary underline cursor-pointer" @click="handleViewItems()">
      View {{ props.column?.header || 'Items' }} ({{ props.data?.length || 0 }})
    </a>
  </template>

  <template v-else-if="props.column.type === 'date' || props.column.labelFormat">
    <template v-if="!!props.data">
      {{ formatDate(props.data, props.column.labelFormat === 'default' ? undefined : props.column.labelFormat) }}
    </template>
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
      :color="props.column.enum?.find(it => it.value === props.data)?.color"
      :label="props.column.enum?.find(it => it.value === props.data)?.label ?? props.data"
    />
  </template>

  <template v-else-if="typeof props.data === 'number'">
    {{ props.data.toLocaleString() }}
  </template>

  <template v-else>
    {{ props.data }}
  </template>

</template>
