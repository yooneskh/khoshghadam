<script setup>

/* interface */

const props = defineProps({
  resource: String,
  actions: Array,
  resourceActions: Array,
});


/* resource */

const resourceExplorerTableEl = useTemplateRef('resourceExplorerTable');


const { resource, resourcePath, title, titlePlural } = useResourceName({
  resource: () => props.resource,
});

const { fields } = useResourceMeta({
  resource,
});


useHead({
  title: titlePlural,
});


const actions = computed(() => {
  return [
    {
      icon: 'lucide:plus',
      label: `Create a ${title.value}`,
      onClick: handleResourceCreate,
    },
    ...(props.actions || []),
    {
      icon: 'lucide:refresh-ccw',
      onClick: refreshResources,
    },
  ];
});

const resourceActions = computed(() => {
  return [
    ...(props.resourceActions || []),
    {
      icon: 'lucide:pencil',
      tooltip: 'Edit',
      onClick: handleResourceUpdate,
    },
    {
      color: 'error',
      icon: 'lucide:trash',
      tooltip: 'Delete',
      onClick: handleResourceDelete,
    },
  ];
});


async function refreshResources() {
  await resourceExplorerTableEl.value?.refreshResources();
}

async function handleResourceCreate() {
  await launchFormPickerDialog({
    title: `Create ${title.value}`,
    subtitle: 'Create a new resource',
    text: `Fill in the form below to create a new ${title.value}.`,
    modalOptions: {
      scrollable: true,
      ui: {
        content: 'max-w-xl',
      },
    },
    fields: fields.value,
    submitButton: {
      icon: 'lucide:plus',
      label: 'Create',
      onClick: async form => {

        await ufetch(`/api/${resourcePath.value}`, {
          method: 'post',
          body: form,
        });


        await refreshResources();

        toastSuccess({
          title: `${title.value} created successfully.`,
        });

      },
    },
  });
}

async function handleResourceUpdate(resource) {
  await launchFormPickerDialog({
    title: `Update ${title.value}`,
    subtitle: resource._id,
    text: 'Update the information and click submit to save.',
    modalOptions: {
      scrollable: true,
      ui: {
        content: 'max-w-xl',
      },
    },
    fields: fields.value,
    initialForm: radOmit(resource, ['_id', 'createdAt', 'updatedAt']),
    submitButton: {
      icon: 'lucide:pencil',
      label: 'Update',
      onClick: async form => {

        await ufetch(`/api/${resourcePath.value}/${resource._id}`, {
          method: 'patch',
          body: form,
        });


        evictResource({
          resourcePath: resourcePath.value,
          id: resource._id,
        });


        await refreshResources();

        toastSuccess({
          title: `${title.value} updated successfully.`,
        });

      },
    },
  });
}

async function handleResourceDelete(resource) {
  await launchChoicePickerDialog({
    title: `Delete ${title.value}`,
    subtitle: resource._id,
    text: `Are you sure you want to delete this ${title.value}?`,
    startButtons: [
      {
        color: 'error',
        icon: 'lucide:trash',
        label: 'Delete',
        onClick: async () => {

          await ufetch(`/api/${resourcePath.value}/${resource._id}`, {
            method: 'delete',
          });


          evictResource({
            resourcePath: resourcePath.value,
            id: resource._id,
          });


          await refreshResources();

          toastSuccess({
            title: `${title.value} deleted successfully.`,
          });

        },
      },
    ],
  });
}


/* outlets */

defineExpose({
  refreshResources,
});

</script>


<template>
  <un-card
    :title="`Manage ${titlePlural}`"
    fluid-body
    :append-actions="actions">
    <resource-explorer-table
      ref="resourceExplorerTable"
      :resource="resource"
      :actions="resourceActions"
    />
  </un-card>
</template>
