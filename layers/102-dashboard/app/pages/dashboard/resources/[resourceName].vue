<script setup>

/* page */

definePageMeta({
  name: 'dashboard.resources.single',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});


const route = useRoute();

const resourceName = computed(() => {
  return route.params.resourceName;
});

</script>


<template>
  <resource-manager :resource="resourceName" />
</template>
