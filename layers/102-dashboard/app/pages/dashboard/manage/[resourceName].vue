<script setup>

/* responsibility */

// Manages any singleton
// named by the route.


/* page */

definePageMeta({
  name: 'dashboard.manage.single',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});


/* params */

const route = useRoute();


const resourceName = computed(() => {
  return route.params.resourceName;
});


/* singleton */

const { title } = useResourceName({
  resource: () => resourceName.value,
});


/* seo */

useHead({
  title,
});

useSeoMeta({
  description: 'Manage a dashboard singleton.',
});

</script>


<template>
  <singleton-manager :resource="resourceName" />
</template>
