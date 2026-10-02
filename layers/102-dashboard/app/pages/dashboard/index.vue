<script setup>

/* responsibility */

// Shows the dashboard landing page
// with a welcome placeholder.


/* page */

definePageMeta({
  name: 'dashboard.home',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});


/* seo */

useHead({
  title: 'Dashboard',
});

useSeoMeta({
  description: 'Welcome to the dashboard.',
});

</script>


<template>
  <u-empty
    variant="naked"
    icon="lucide:layout-dashboard"
    title="Dashboard"
    description="Welcome to the dashboard"
  />
</template>
