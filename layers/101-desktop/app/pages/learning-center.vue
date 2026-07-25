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
          name: 'Flash Cards',
          to: {
            name: 'flash-cards.list',
          },
        },
      ]"
    />
  </window-base>
</template>
