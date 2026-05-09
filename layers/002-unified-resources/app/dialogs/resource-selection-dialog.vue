<script setup>

/* interface */

const props = defineProps({
  resource: String,
  items: Array,
  multiple: Boolean,
  onSelected: Function,
});

const emit = defineEmits([
  'close',
]);


/* resource */

const currentItems = ref(radCloneDeep(props.items || []));
const currentItemsTitles = ref({});


const { resourcePath, title, titlePlural } = useResourceName({
  resource: () => props.resource,
});


watchImmediate(currentItems, async () => {
  await Promise.all(
    currentItems.value.map(async it => {

      if (currentItemsTitles.value[it]) {
        return;
      }


      const resource = await ufetch(`/${resourcePath.value}/${it}`);

      currentItemsTitles.value[it] = resource.name || truncateMiddle(resource._id);

    }),
  );
});


async function handleSelectResource(resource) {
  if (!props.multiple) {
    await handleSubmitSelection([resource._id]);
  }
  else {
    currentItems.value = radToggle(currentItems.value, resource._id);
  }
}

async function handleSubmitSelection(items) {
  await props.onSelected?.(items);
  emit('close', items);
}

</script>


<template>
  <u-modal :ui="{ content: 'max-w-5xl' }" @update:open="!$event && emit('close')">
    <template #content>
      <un-card
        icon="lucide:bookmark"
        :title="`Select ${props.multiple ? titlePlural : title}`"
        :subtitle="props.multiple ? 'Select one or more ' + titlePlural : 'Select one ' + title"
        fluid-body
        :actions="[
          ...(!props.multiple ? [] : [{
            icon: 'lucide:check',
            label: 'Submit Selection',
            onClick: () => handleSubmitSelection(currentItems),
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

        <template v-if="props.multiple">
          <div class="flex items-center gap-2 border-b border-default p-3">
            <template v-for="(item, index) of currentItems" :key="item">
              <u-badge
                variant="subtle"
                :label="currentItemsTitles[item] || '-'"
                trailing-icon="lucide:x">
                <template #trailing>
                  <u-icon
                    name="lucide:x"
                    @click="currentItems.splice(index, 1)"
                  />
                </template>
              </u-badge>
            </template>
          </div>
        </template>

        <resource-explorer-table
          :resource="props.resource"
          :actions="[
            {
              vIf: it => !props.multiple || !currentItems.includes(it._id),
              icon: 'lucide:check',
              label: 'Select',
              onClick: handleSelectResource,
            },
            {
              vIf: it => props.multiple && currentItems.includes(it._id),
              color: 'error',
              icon: 'lucide:trash',
              label: 'Remove',
              onClick: handleSelectResource,
            },
          ]"
        />

      </un-card>
    </template>
  </u-modal>
</template>
