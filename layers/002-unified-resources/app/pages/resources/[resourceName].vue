<script setup>

/* page */

definePageMeta({
  name: 'unified-mongo.resources',
});

useHead({
  title: 'Resources',
});


const resourceName = computed(() => {
  return useRoute().params.resourceName;
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
    title: 'Create Resource',
    subtitle: radCapitalize(resourceName.value),
    text: 'Are you sure you want to create this resource?',
    fields: Object.keys(schema.value ?? {}).map(it => ({
      key: it,
      identifier: 'input',
      label: radCapitalize(it),
    })),
    submitButton: {
      onClick: async form => {

        await ufetch(`/${resourceName.value}`, {
          method: 'post',
          body: form,
        });


        await refreshResources();

        toastSuccess({
          title: 'Resource created',
        });

      }
    }
  });
}

async function handleResourceUpdate(resource) {
  await launchFormPickerDialog({
    title: 'Update Resource',
    subtitle: resource._id,
    text: 'Update information and click submit to save.',
    fields: Object.keys(schema.value ?? {}).map(it => ({
      key: it,
      identifier: 'input',
      label: radCapitalize(it),
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
          title: 'Resource updated',
        });

      },
    },
  });
}

async function handleResourceDelete(resource) {
  await launchChoicePickerDialog({
    title: 'Delete Resource',
    subtitle: resource._id,
    text: 'Are you sure you want to delete this resource?',
    startButtons: [
      {
        label: 'Delete',
        onClick: async () => {

          await ufetch(`/${resourceName.value}/${resource._id}`, {
            method: 'delete',
          });


          toastSuccess({
            title: 'Resource deleted',
          });

          await refreshResources();

        },
      },
    ],
  });
}

</script>


<template>
  <window-base pito="my-documents" :title="radCapitalize(resourceName)">

    <un-card
      :title="`Manage ${resourceName}`"
      class="m-3"
      :append-actions="[
        {
          label: 'Create',
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
