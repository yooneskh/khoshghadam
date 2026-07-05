<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* resource */

const isLoading = ref(false);


const resources = asyncComputed(async () => {

  if (!modelValue.value) {
    return '';
  }


  try {

    isLoading.value = true;


    return await Promise.all(
      radCastArray(modelValue.value).map(async it =>
        ufetch(`/api/media/${it}`),
      ),
    );

  }
  finally {
    isLoading.value = false;
  }

});

const title = computed(() => {

  if (!resources.value?.length) {
    return '';
  }


  return resources.value?.map(it => it.name).join(' - ');

});


async function handleSelectMedia() {
  await launchMediaLibraryDialog({
    items: radCastArray(modelValue.value || []),
    multiple: props.field.multiple,
    onSelected: async selecteds => {
      if (props.field.multiple) {
        modelValue.value = selecteds;
      }
      else {
        modelValue.value = selecteds?.[0];
      }
    }
  });
}

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'label', 'hint', 'help', 'description' ])">
    <u-input
      class="w-full"
      trailing-icon="lucide:file-badge"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'label', 'hint', 'help', 'description' ])"
      readonly
      :model-value="title"
      :loading="isLoading"
      @click="handleSelectMedia()"
      @keypress.space="handleSelectMedia()"
      @keypress.enter="handleSelectMedia()">

      <template #trailing>
        <div class="flex items-center gap-2">

          <template v-for="resource of resources" :key="resource._id">
            <template v-if="resource.type?.startsWith('image')">
              <u-popover mode="hover">

                <img
                  :src="resource.variants?.thumb || resource.path"
                  class="size-5 rounded"
                />

                <template #content>
                  <img
                    :src="resource.variants?.small || resource.path"
                    class="max-w-sm rounded"
                  />
                </template>

              </u-popover>
            </template>
            <template v-else>
              <u-icon
                name="lucide:file"
                class="size-5"
              />
            </template>
          </template>

          <u-icon
            name="lucide:file-badge"
            class="size-5 text-dimmed"
          />

        </div>
      </template>

    </u-input>
  </u-form-field>
</template>
