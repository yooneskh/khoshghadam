<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.single',
});

useSeoMeta({
  title: 'Flash Card',
  description: 'Flash cards are a great way to learn new information.',
});


/* flash cards */

const { data: flashCardData } = useUFetch(
  '/api/flash-cards',
  {
    query: {
      'filter': computed(() => `slug:eq:${useRoute().params.flashCardSlug}`),
      'single': 'xtruex',
    },
  },
);

</script>


<template>
  <window-base
    pito="address-book"
    title="Flash Cards">
    <div class="p-2">
      <h1 class="text-2xl font-bold">
        {{ flashCardData?.name }}
      </h1>
      <h3>
        {{ flashCardData?.cards?.length }} cards
      </h3>
      <u-button
        icon="lucide:play"
        label="Start Learning"
        class="mt-3"
      />
    </div>
  </window-base>
</template>
