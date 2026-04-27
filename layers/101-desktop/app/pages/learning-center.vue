<script setup>

/* page */

definePageMeta({
  name: 'desktop.learning-center',
});

useSeoMeta({
  title: 'Learning Center',
  description: 'Tools to help you in learning multiple aspects of education.',
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
          name: 'Flash Cards',
          to: {
            name: 'flash-cards.list',
          },
        },
      ]"
    />
  </window-base>
</template>
