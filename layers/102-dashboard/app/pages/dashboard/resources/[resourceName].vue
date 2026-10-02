<script setup>

/* responsibility */

// Manages any standard resource
// named by the route.


/* page */

definePageMeta({
  name: 'dashboard.resources.single',
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


/* seo */

useHead({
  title: () => radTitle(resourceName.value),
});

useSeoMeta({
  description: 'Manage dashboard resources.',
});

</script>


<template>
  <resource-manager :resource="resourceName" />
</template>
