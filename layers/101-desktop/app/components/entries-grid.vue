<script setup>

/* interface */

const props = defineProps({
  items: Array,
});

</script>


<template>
  <div class="flex flex-row items-start flex-wrap gap-3 p-3">

    <template v-for="item in props.items" :key="item.name">
      <nuxt-link
        class="
          flex flex-col items-center gap-1
          w-20 p-2
          hover:bg-primary/50
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
    </template>

  </div>
</template>
