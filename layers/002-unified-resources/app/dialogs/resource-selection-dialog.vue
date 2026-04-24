<script setup>

/* interface */

const props = defineProps({
  resource: String,
  items: Array,
  multiple: Boolean,
});

const emit = defineEmits([
  'close',
]);


/* resource */

const currentItems = ref(JSON.parse(JSON.stringify(props.items || [])));


const resourceTitle = computed(() => {
  return {
    plural: wordToPlural(radTitle(props.resource)),
    singular: wordToSingular(radTitle(props.resource)),
  };
});


function handleSelectResource(resource) {

  if (!props.multiple) {
    emit('close', [resource._id]);
    return;
  }


  if (currentItems.value.includes(resource._id)) {
    currentItems.value = currentItems.value.filter(it => it !== resource._id);
  }
  else {
    currentItems.value.push(resource._id);
  }

}

</script>


<template>
  <u-modal :ui="{ content: 'max-w-5xl' }" @update:open="!$event && emit('close')">
    <template #content>
      <un-card
        icon="lucide:bookmark"
        :title="`Select ${props.multiple ? resourceTitle.plural : resourceTitle.singular}`"
        :subtitle="props.multiple ? 'Select one or more ' + resourceTitle.plural : 'Select one ' + resourceTitle.singular"
        fluid-body
        :actions="[
          ...(!props.multiple ? [] : [{
            icon: 'lucide:check',
            label: 'Submit Selection',
            onClick: () => emit('close', currentItems),
          }]),
          {
            actionType: 'spacer',
          },
          {
            variant: 'ghost',
            label: $t('common.cancel'),
            onClick: () => emit('close'),
          },
        ]">
        <resource-explorer-table
          :resource="radDash(resourceTitle.plural)"
          :actions="[
            {
              icon: 'lucide:check',
              label: 'Select',
              onClick: handleSelectResource,
            }
          ]"
        />
      </un-card>
    </template>
  </u-modal>
</template>
