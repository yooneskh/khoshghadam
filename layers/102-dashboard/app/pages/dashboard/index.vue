<script setup>

/* page */

definePageMeta({
  name: 'dashboard.home',
  layout: 'dashboard',
});

useHead({
  title: 'Dashboard',
});


const { form, formTag } = useForm({
  fields: [
    {
      key: 'file',
      identifier: 'input',
      label: 'File',
      type: 'file',
    },
  ],
});

async function handleUpload() {

  const body = new FormData();
  body.append('file', form.value.file);

  const response = await ufetch('/api/media/upload', {
    method: 'post',
    body,
  });

  console.log({ response });

  window.open(response.path, '_blank');

}

</script>


<template>
  <div>
    <u-empty
      variant="naked"
      icon="lucide:layout-dashboard"
      title="Dashboard"
      description="Welcome to the dashboard"
    />

    <form-tag />
    <u-button label="Upload" loading-auto @click="handleUpload" />
  </div>
</template>
