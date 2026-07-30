<script setup>

/* page */

definePageMeta({
  name: 'dashboard.home',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});

useHead({
  title: 'Dashboard',
});

</script>


<template>
  <div>
    <u-empty
      variant="naked"
      icon="lucide:layout-dashboard"
      title="Dashboard"
      description="Welcome to the dashboard"
    />
  </div>
</template>
