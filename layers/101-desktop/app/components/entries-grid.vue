<script setup>

/* interface */

const props = defineProps({
  items: Array,
});

</script>


<template>
  <div class="flex flex-row items-start flex-wrap gap-4 p-4">

    <nuxt-link
      v-for="item in props.items" :key="item.name"
      class="
        flex flex-col items-center gap-1
        w-20 p-2
        hover:bg-blue-500/40
      "
      :to="item.to">

      <img
        :src="`/pitos/${item.pito}.png`"
        class="size-11"
      />

      <span class="text-sm font-medium text-center">
        {{ item.name }}
      </span>

    </nuxt-link>

  </div>
</template>
