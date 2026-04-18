<script setup>

/* page */

definePageMeta({
  name: 'unified-resources.resources',
});


const route = useRoute();

const resourceName = computed(() => {
  return route.params.resourceName;
});

const resourceTitle = computed(() => {
  return {
    plural: wordToPlural(radTitle(resourceName.value)),
    singular: wordToSingular(radTitle(resourceName.value)),
  };
});


useHead({
  title: computed(() => {
    return `${resourceTitle.value.plural} - Resources`;
  }),
});


/* resource */

const itemsPerPage = ref(5);
const currentPage = ref(1);


const { data: resourcesData, pending: isResourcesLoading, refresh: refreshResources } = useUFetch(
  computed(() => `/${resourceName.value}`),
  {
    query: {
      'skip': computed(() => (currentPage.value - 1) * itemsPerPage.value),
      'limit': computed(() => itemsPerPage.value),
    },
  },
);

const { data: resourcesCountData, refresh: refreshResourcesCount } = useUFetch(
  computed(() => `/${resourceName.value}/count`),
);


const { fields } = useResourceFormFields({
  resource: resourceName,
});


async function handleResourceCreate() {
  await launchFormPickerDialog({
    title: `Create ${resourceTitle.value.singular}`,
    subtitle: 'Create a new resource',
    text: `Fill in the form below to create a new ${resourceTitle.value.singular}.`,
    fields: fields.value,
    submitButton: {
      icon: 'lucide:plus',
      label: `Create ${resourceTitle.value.singular}`,
      onClick: async form => {

        await ufetch(`/${resourceName.value}`, {
          method: 'post',
          body: form,
        });


        await refreshResources();
        await refreshResourcesCount();

        toastSuccess({
          title: `${resourceTitle.value.singular} created successfully.`,
        });

      }
    },
  });
}

async function handleResourceUpdate(resource) {
  await launchFormPickerDialog({
    title: `Update ${resourceTitle.value.singular}`,
    subtitle: resource._id,
    text: `Update the information and click submit to save.`,
    fields: fields.value,
    initialForm: radOmit(resource, ['_id', 'createdAt', 'updatedAt']),
    submitButton: {
      icon: 'lucide:pencil',
      label: `Update ${resourceTitle.value.singular}`,
      onClick: async form => {

        await ufetch(`/${resourceName.value}/${resource._id}`, {
          method: 'patch',
          body: form,
        });


        await refreshResources();
        await refreshResourcesCount();

        toastSuccess({
          title: `${resourceTitle.value.singular} updated successfully.`,
        });

      },
    },
  });
}

async function handleResourceDelete(resource) {
  await launchChoicePickerDialog({
    title: `Delete ${resourceTitle.value.singular}`,
    subtitle: resource._id,
    text: `Are you sure you want to delete this ${resourceTitle.value.singular}?`,
    startButtons: [
      {
        color: 'error',
        icon: 'lucide:trash',
        label: `Delete ${resourceTitle.value.singular}`,
        onClick: async () => {

          await ufetch(`/${resourceName.value}/${resource._id}`, {
            method: 'delete',
          });


          await refreshResources();
          await refreshResourcesCount();

          toastSuccess({
            title: `${resourceTitle.value.singular} deleted successfully.`,
          });

        },
      },
    ],
  });
}

</script>


<template>
  <window-base
    pito="my-documents"
    :title="`${resourceTitle.singular} Resources`">

    <un-card
      :title="`Manage ${resourceTitle.plural}`"
      class="m-3"
      :append-actions="[
        {
          icon: 'lucide:plus',
          label: `Create a ${resourceTitle.singular}`,
          onClick: handleResourceCreate,
        },
      ]"
    />

    <un-table
      :columns="fields.map(it => ({
        accessorKey: it.key,
        header: it.label,
      }))"
      :loading="isResourcesLoading"
      :data="resourcesData"
      :total-items="resourcesCountData"
      v-model:items-per-page="itemsPerPage"
      v-model:current-page="currentPage"
      class="mx-3 mb-3 border border-default rounded-lg"
      :actions="[
        {
          tooltip: 'Edit',
          icon: 'lucide:pencil',
          onClick: handleResourceUpdate,
        },
        {
          color: 'error',
          tooltip: 'Delete',
          icon: 'lucide:trash',
          onClick: handleResourceDelete,
        },
      ]"
    />

  </window-base>
</template>
