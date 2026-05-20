<script setup>

/* page */

definePageMeta({
  name: 'flash-cards.single',
});


const route = useRoute();

const flashCardSlug = computed(() => {
  return route.params.flashCardSlug;
});


/* flash cards */

const { data: flashCardData, pending: isFlashCardPending } = useUFetch(
  '/api/flash-cards',
  {
    query: {
      'filter': computed(() => `slug:eq:${flashCardSlug.value}`),
      'single': 'xtruex',
      'populate': 'owner:name,category:name',
    },
  },
);


useSeoMeta({
  title: () => flashCardData.value?.name,
  description: () => flashCardData.value?.description,
});

</script>


<template>
  <window-base
    pito="address-book"
    :title="`${flashCardData?.name || '-'}`"
    :loading="isFlashCardPending"
    :actions="[
      {
        icon: 'lucide:play',
        label: 'Start Learning',
        to: {
          name: 'flash-cards.single.learn',
          params: {
            flashCardSlug: flashCardSlug,
          },
        },
      },
    ]">
    <div class="p-2">
      <h1 class="text-2xl font-bold">
        {{ flashCardData?.name }}
      </h1>
      <h2>
        {{ flashCardData?.category?.name }} - by {{ flashCardData?.owner?.name }}
      </h2>
      <div class="flex items-center gap-2 mt-1">
        <template v-for="tag of flashCardData?.tags" :key="tag">
          <u-badge
            variant="subtle"
            :label="tag"
          />
        </template>
      </div>
      <p class="mt-4">
        {{ flashCardData?.description }}
      </p>
    </div>
  </window-base>
</template>
