<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* resource */

const isLoading = ref(false);


const title = asyncComputed(async () => {

  if (!modelValue.value) {
    return '';
  }


  try {

    isLoading.value = true;


    const resources = await Promise.all(
      (radIsArray(modelValue.value) ? modelValue.value : [modelValue.value]).map(async it =>
        ufetch(`/${radDash(wordToPlural(props.field.resource))}/${it}`),
      ),
    );


    return resources.map(it => it.name).join(' - ');

  }
  finally {
    isLoading.value = false;
  }

});


async function handleResourceSelect() {

  const selecteds = await launchResourceSelectionDialog({
    resource: props.field.resource,
    items: !modelValue.value ? [] : radIsArray(modelValue.value) ? modelValue.value : [modelValue.value],
    multiple: props.field.multiple,
  });


  if (props.field.multiple) {
    modelValue.value = selecteds;
  }
  else {
    modelValue.value = selecteds[0];
  }

}

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'label', 'hint', 'help', 'description' ])">
    <u-input
      class="w-full"
      trailing-icon="lucide:clipboard-list"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'label', 'hint', 'help', 'description' ])"
      readonly
      :model-value="title"
      :loading="isLoading"
      @click="handleResourceSelect()"
      @keypress.space="handleResourceSelect()"
      @keypress.enter="handleResourceSelect()"
    />
  </u-form-field>
</template>
