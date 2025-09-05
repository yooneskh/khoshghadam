<script setup>

/* page */

definePageMeta({
  name: 'public.finance-101',
});

useSeoMeta({
  title: 'Finance 101',
  description: 'Essential concepts of finance alongside their live calculators for you to see exactly what is going on.',
});

</script>


<template>
  <window-base pito="event-viewer" title="Finance 101">
    
    <entries-grid
      :items="[
        {
          pito: 'event-viewer',
          name: 'Compound Interest',
          to: '/finance-101/compound-interest',
        },
      ]"
    />

  </window-base>
</template>
