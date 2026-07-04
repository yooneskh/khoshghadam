<script setup>

/* interface */

const props = defineProps({
  column: Object,
  row: Object,
  data: String,
});

const emit = defineEmits([
  'resource:update',
]);


/* resource */

const tickle = ref(0);
const isLoading = ref(false);


const { fields } = useResourceMeta({
  resource: () => props.column.resource,
});

const { title, resourcePath } = useResourceName({
  resource: () => props.column.resource,
});


const resourceData = asyncComputed(async () => {

  tickle.value;

  if (!props.column.resource || !props.data) {
    return;
  }


  try {

    isLoading.value = true;

    const value = await ufetch(`/api/${resourcePath.value}/${props.data}`, {
      silent: true,
    });

    return value;

  }
  finally {
    isLoading.value = false;
  }

});


async function handleResourceClick() {
  await launchFormPickerDialog({
    title: `Update ${title.value}`,
    subtitle: resourceData.value._id,
    text: `Update the information and click submit to save.`,
    modalOptions: {
      scrollable: true,
      ui: {
        content: 'max-w-xl',
      },
    },
    fields: fields.value,
    initialForm: radOmit(resourceData.value, ['_id', 'createdAt', 'updatedAt']),
    submitButton: {
      icon: 'lucide:pencil',
      label: `Update`,
      onClick: async form => {

        await ufetch(`/api/${resourcePath.value}/${resourceData.value._id}`, {
          method: 'patch',
          body: form,
        });


        tickle.value++;

        toastSuccess({
          title: `${title.value} updated successfully.`,
        });

      },
    },
  });
}

</script>


<template>
  <template v-if="isLoading">
    <un-spinner />
  </template>
  <template v-else-if="!resourceData">
    <u-tooltip text="Deleted">
      <u-icon
        name="lucide:triangle-alert"
        class="text-error"
      />
    </u-tooltip>
  </template>
  <template v-else>
    <a class="text-primary underline cursor-pointer" @click="handleResourceClick()">
      {{ resourceData.name }}
    </a>
  </template>
</template>
