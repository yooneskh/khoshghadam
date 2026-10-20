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


/* statistics */

const statistics = [
  {
    resource: 'users',
    icon: 'lucide:users',
    title: 'Users',
    color: 'primary',
  },
  {
    resource: 'flash-cards',
    icon: 'lucide:layers',
    title: 'Flash Cards',
    color: 'info',
  },
  {
    resource: 'omani-ideas',
    icon: 'lucide:lightbulb',
    title: 'Omani Ideas',
    color: 'success',
  },
  {
    resource: 'media',
    icon: 'lucide:image',
    title: 'Media',
    color: 'warning',
  },
  {
    resource: 'businesses',
    icon: 'lucide:store',
    title: 'Businesses',
    color: 'neutral',
  },
];

</script>


<template>
  <div class="space-y-3">

    <resource-statistics
      :statistics="statistics"
    />

    <u-empty
      variant="naked"
      icon="lucide:layout-dashboard"
      title="Dashboard"
      description="Welcome to the dashboard"
    />

  </div>
</template>
