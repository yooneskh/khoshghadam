<script setup>

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

</script>


<template>
  <u-modal :ui="{ content: 'max-w-5xl' }" scrollable @update:open="!$event && emit('close')">
    <template #content>
      <un-card :icon="props.icon" :title="props.title" :subtitle="props.subtitle" fluid-body :actions="props.cardActions">
        <un-table
          :columns="props.columns"
          :data="props.data"
          hide-pagination
          :actions="props.tableActions"
        />
      </un-card>
    </template>
  </u-modal>
</template>
