<script setup>

/* apps */

const applications = ref([
  {
    icon: 'i-lucide:user',
    name: 'Who Am I?',
    to: '/who-am-i',
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

      <u-icon
        :name="app.icon"
        class="size-8"
      />

      <span class="text-sm font-medium text-center">
        {{ app.name }}
      </span>

    </nuxt-link>

  </div>
</template>
