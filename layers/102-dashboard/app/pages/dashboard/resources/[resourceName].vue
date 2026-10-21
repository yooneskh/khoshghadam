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


/* resource */

const { titlePlural } = useResourceName({
  resource: () => resourceName.value,
});


/* seo */

useHead({
  title: titlePlural,
});

useSeoMeta({
  description: 'Manage dashboard resources.',
});

</script>


<template>
  <resource-manager :resource="resourceName" />
</template>
