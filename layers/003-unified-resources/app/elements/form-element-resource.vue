<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* resource */

const isLoading = ref(false);


const { resourcePath } = useResourceName({
  resource: () => props.field.resource,
});


const title = asyncComputed(async () => {

  if (!modelValue.value) {
    return '';
  }


  try {

    isLoading.value = true;


    const resources = await Promise.all(
      radCastArray(modelValue.value).map(async it =>
        retrieveResource({
          resourcePath: resourcePath.value,
          id: it,
        }),
      ),
    );


    return resources.map(it => it.name || truncateMiddle(it._id)).join(' - ');

  }
  finally {
    isLoading.value = false;
  }

});


async function handleResourceSelect() {
  await launchResourceSelectionDialog({
    resource: props.field.resource,
    items: !modelValue.value ? [] : radCastArray(modelValue.value),
    multiple: props.field.multiple,
    onSelected: async selecteds => {
      if (props.field.multiple) {
        modelValue.value = selecteds;
      }
      else {
        modelValue.value = selecteds?.[0];
      }
    },
  });
}

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'label', 'hint', 'help', 'description' ])">
    <u-input
      trailing-icon="lucide:clipboard-list"
      class="w-full"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'label', 'hint', 'help', 'description' ])"
      :loading="isLoading"
      readonly
      :model-value="title"
      @click="handleResourceSelect()"
      @keypress.space="handleResourceSelect()"
      @keypress.enter="handleResourceSelect()"
    />
  </u-form-field>
</template>
