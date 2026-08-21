<script setup>

/* page */

definePageMeta({
  name: 'desktop.learning-center',
});

useHead({
  title: 'Learning Center',
});

</script>


<template>
  <window-base
    pito="address-book"
    title="Learning Center">
    <entries-grid
      :items="[
        {
          pito: 'address-book',
          name: 'Flash Lessons',
          to: {
            name: 'flash-cards.list',
          },
        },
        {
          pito: 'address-book',
          name: 'Flash Journeys',
          to: {
            name: 'flash-cards.flash-card-journeys.list',
          },
        },
      ]"
    />
  </window-base>
</template>
