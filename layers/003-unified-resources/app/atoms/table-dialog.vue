<script setup>

/* responsibility */

// Shows a list of rows
// as a table inside a modal card.


/* interface */

const props = defineProps({
  icon: String,
  title: String,
  subtitle: String,
  cardActions: Array,
  columns: Array,
  data: Array,
  tableActions: Array,
});

const emit = defineEmits([
  'close',
]);


/* cell */

import ResourceExplorerCell from './resource-explorer-cell.vue';

</script>


<template>
  <u-modal :ui="{ content: 'max-w-5xl' }" scrollable @update:open="!$event && emit('close')">
    <template #content>
      <un-card :icon="props.icon" :title="props.title" :subtitle="props.subtitle" fluid-body :actions="props.cardActions">
        <un-table
          :columns="props.columns"
          :data="props.data"
          hide-pagination
          :actions="props.tableActions">
          <template v-for="column in props.columns" :key="column.accessorKey+'-cell'" #[column.accessorKey+'-cell']="{ row }">
            <resource-explorer-cell
              :column="column"
              :row="row.original"
              :data="row.original[column.accessorKey]"
            />
          </template>
        </un-table>
      </un-card>
    </template>
  </u-modal>
</template>
