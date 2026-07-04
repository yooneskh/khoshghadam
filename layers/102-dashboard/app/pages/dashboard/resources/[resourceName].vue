<script setup>

/* page */

definePageMeta({
  name: 'dashboard.resources.single',
  layout: 'dashboard',
});


const route = useRoute();

const resourceName = computed(() => {
  return route.params.resourceName;
});


const { resource, resourcePath, title, titlePlural } = useResourceName({
  resource: resourceName,
});


useHead({
  title: titlePlural,
});


/* resource */

const resourceExplorerTableEl = useTemplateRef('resourceExplorerTable');


const { fields } = useResourceMeta({
  resource,
});


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
      label: `Create`,
      onClick: async form => {

        await ufetch(`/api/${resourcePath.value}`, {
          method: 'post',
          body: form,
        });


        await resourceExplorerTableEl.value.refreshResources();

        toastSuccess({
          title: `${title.value} created successfully.`,
        });

      }
    },
  });
}

async function handleResourceUpdate(resource) {
  await launchFormPickerDialog({
    title: `Update ${title.value}`,
    subtitle: resource._id,
    text: `Update the information and click submit to save.`,
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
      label: `Update`,
      onClick: async form => {

        await ufetch(`/api/${resourcePath.value}/${resource._id}`, {
          method: 'patch',
          body: form,
        });


        await resourceExplorerTableEl.value.refreshResources();

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
        label: `Delete`,
        onClick: async () => {

          await ufetch(`/api/${resourcePath.value}/${resource._id}`, {
            method: 'delete',
          });


          await resourceExplorerTableEl.value.refreshResources();

          toastSuccess({
            title: `${title.value} deleted successfully.`,
          });

        },
      },
    ],
  });
}

</script>


<template>
  <div class="space-y-3">

    <un-typography :title="`Manage ${titlePlural}`">
      <template #append>
        <u-button
          icon="lucide:plus"
          :label="`Create a ${title}`"
          loading-auto
          @click="handleResourceCreate()"
        />
      </template>
    </un-typography>

    <resource-explorer-table
      ref="resourceExplorerTable"
      :resource="resource"
      class="-mx-3 -mb-3 border-t border-default"
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

  </div>
</template>
