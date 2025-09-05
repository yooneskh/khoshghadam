<script setup>

/* apps */

const applications = ref([
  {
    pito: 'my-documents',
    name: 'Who Am I?',
    to: '/who-am-i',
  },
  {
    pito: 'event-viewer',
    name: 'Finance 101',
    to: '/finance-101',
  },
]);

</script>


<template>
  <div class="flex flex-row items-start flex-wrap gap-4 p-4">

    <nuxt-link
      v-for="app in applications" :key="app.name"
      class="
        flex flex-col items-center gap-1
        w-20 p-2
        text-white
        hover:bg-blue-500/40
      "
      :to="app.to">

      <img
        :src="`/pitos/${app.pito}.png`"
        class="size-11"
      />

      <span class="text-sm font-medium text-center">
        {{ app.name }}
      </span>

    </nuxt-link>

  </div>
</template>
