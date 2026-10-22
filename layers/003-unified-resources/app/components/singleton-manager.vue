<script setup>

/* responsibility */

// Renders the form card
// for one unified singleton row.


/* interface */

const props = defineProps({
  resource: String,
});


/* singleton */

import { useResourceMeta } from '../libs/use-resource-meta';


const { resource, resourcePath, title } = useResourceName({
  resource: () => props.resource,
});

const { fields } = useResourceMeta({
  resource,
});


const { data: singletonData, pending: isSingletonPending, refresh: refreshSingleton } = useUFetch(
  computed(() => `/api/${resourcePath.value}`),
  {
    deep: true,
  },
);


const { form, formTag } = useForm({
  target: singletonData,
  fields,
});


const actions = computed(() => {

  if (!singletonData.value) {
    return [];
  }


  return [
    {
      variant: 'subtle',
      icon: 'lucide:save',
      label: 'Save',
      onClick: handleSave,
    },
  ];

});


async function handleSave() {

  await ufetch(`/api/${resourcePath.value}`, {
    method: 'patch',
    body: radOmit(form.value, [
      '_id',
      'createdAt',
      'updatedAt',
    ]),
  });


  await refreshSingleton();

  toastSuccess({
    title: `${title.value} saved.`,
  });

}


/* seo */

useHead({
  title,
});


/* outlets */

defineExpose({
  refreshSingleton,
});

</script>


<template>
  <un-card :title="title" :append-actions="actions">

    <template v-if="isSingletonPending && !singletonData">
      <un-spinner />
    </template>

    <template v-else-if="singletonData">
      <form-tag />
    </template>

  </un-card>
</template>
