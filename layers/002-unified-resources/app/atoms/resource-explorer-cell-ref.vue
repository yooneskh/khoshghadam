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

const tickle = ref(0);


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


  return ufetch(`/${resourcePath.value}/${props.data}`);

});


async function handleResourceClick() {
  await launchFormPickerDialog({
    title: `Update ${title.value}`,
    subtitle: resourceData.value._id,
    text: `Update the information and click submit to save.`,
    fields: fields.value,
    initialForm: radOmit(resourceData.value, ['_id', 'createdAt', 'updatedAt']),
    submitButton: {
      icon: 'lucide:pencil',
      label: `Update`,
      onClick: async form => {

        await ufetch(`/${resourcePath.value}/${resourceData.value._id}`, {
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
  <template v-if="!resourceData && props.data">
    <un-spinner />
  </template>
  <template v-else>
    <a class="text-primary underline cursor-pointer" @click="handleResourceClick()">
      {{ resourceData.name }}
    </a>
  </template>
</template>
