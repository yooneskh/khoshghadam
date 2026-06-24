<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.list',
});

useSeoMeta({
  title: 'Flash Cards',
  description: 'Flash cards are a great way to learn new information.',
});


/* flash cards */

const { data: flashCardsData, pending: isFlashCardsPending } = useUFetch(
  '/api/flash-cards',
);

</script>


<template>
  <window-base
    pito="address-book"
    title="Flash Cards"
    :loading="isFlashCardsPending">
    <entries-grid
      :items="flashCardsData?.map(it => ({
        pito: 'folder-opened',
        name: it.name,
        to: {
          name: 'flash-cards.single',
          params: {
            flashCardSlug: it.slug,
          },
        },
      }))"
    />
  </window-base>
</template>
