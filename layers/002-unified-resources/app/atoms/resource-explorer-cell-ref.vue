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
  resource: () => props.column.ref,
});

const { title, resourcePath } = useResourceName({
  resource: () => props.column.ref,
});


const resourceData = asyncComputed(async () => {

  tickle.value;

  if (!props.column.ref || !props.data) {
    return;
  }


  return ufetch(`/${resourcePath.value}/${props.data}`);

});

const resourceTitle = asyncComputed(async () => {

  tickle.value;

  if (!props.column.ref || !props.data || !props.data?.length) {
    return '';
  }


  const resources = await Promise.all(
    radCastArray(props.data).map(async it =>
      ufetch(`/${resourcePath.value}/${it}`),
    ),
  );


  return resources.map(it => it.name).join(' - ');

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
  <a class="text-primary underline cursor-pointer" @click="handleResourceClick()">
    {{ resourceTitle }}
  </a>
</template>
