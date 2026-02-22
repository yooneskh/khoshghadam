<script setup>

/* page */

definePageMeta({
  name: 'unified-resources.resources',
});


const resourceName = computed(() => {
  return useRoute().params.resourceName;
});

const resourceTitle = computed(() => {
  return {
    plural: wordToPlural(radTitle(resourceName.value)),
    singular: wordToSingular(radTitle(resourceName.value)),
  };
});


useHead({
  title: computed(() => `${resourceTitle.value.plural} - Resources`),
});


/* resource */

const { data: resources, refresh: refreshResources } = useUFetch(
  computed(() => `/${resourceName.value}`),
);

const { data: schema } = useUFetch(
  computed(() => `/${resourceName.value}/schema`),
);


async function handleResourceCreate() {
  await launchFormPickerDialog({
    title: `Create ${resourceTitle.value.singular}`,
    subtitle: 'Create a new resource',
    text: `Fill in the form below to create a new ${resourceTitle.value.singular}.`,
    fields: Object.keys(schema.value ?? {}).map(it => ({
      key: it,
      identifier: 'input',
      label: radTitle(it),
    })),
    submitButton: {
      onClick: async form => {

        await ufetch(`/${resourceName.value}`, {
          method: 'post',
          body: form,
        });


        await refreshResources();

        toastSuccess({
          title: `${resourceTitle.value.singular} created`,
        });

      }
    }
  });
}

async function handleResourceUpdate(resource) {
  await launchFormPickerDialog({
    title: `Update ${resourceTitle.value.singular}`,
    subtitle: resource._id,
    text: `Update the information and click submit to save.`,
    fields: Object.keys(schema.value ?? {}).map(it => ({
      key: it,
      identifier: 'input',
      label: radTitle(it),
    })),
    initialForm: {
      username: resource.username,
    },
    submitButton: {
      onClick: async form => {

        await ufetch(`/${resourceName.value}/${resource._id}`, {
          method: 'patch',
          body: form,
        });


        await refreshResources();

        toastSuccess({
          title: `${resourceTitle.value.singular} updated`,
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
        label: 'Delete',
        onClick: async () => {

          await ufetch(`/${resourceName.value}/${resource._id}`, {
            method: 'delete',
          });


          toastSuccess({
            title: `${resourceTitle.value.singular} deleted`,
          });

          await refreshResources();

        },
      },
    ],
  });
}

</script>


<template>
  <window-base pito="my-documents" :title="`${resourceTitle.singular} Resources`">

    <un-card
      :title="`Manage ${resourceTitle.plural}`"
      class="m-3"
      :append-actions="[
        {
          variant: 'subtle',
          label: `Create a ${resourceTitle.singular}`,
          onClick: () => handleResourceCreate(),
        },
      ]"
    />

    <div class="grid grid-cols-2 gap-3 p-3">
      <template v-for="resource of resources" :key="resource._id">
        <un-card
          :title="`${resource._id.slice(0, 4)}...${resource._id.slice(-4)}`"
          :append-actions="[
            {
              label: 'Update',
              onClick: () => handleResourceUpdate(resource),
            },
            {
              label: 'Delete',
              onClick: () => handleResourceDelete(resource),
            },
          ]">
          <pre>{{ resource }}</pre>
        </un-card>
      </template>
    </div>

  </window-base>
</template>
