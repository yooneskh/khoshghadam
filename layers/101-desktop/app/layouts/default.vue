<script setup>

import BackgroundImage from '~/assets/images/desktop-background.jpg';

</script>


<template>
  <div
    class="
      h-dvh w-screen
      bg-cover bg-center
      relative
    "
    :style="{
      backgroundImage: `url(${BackgroundImage})`
    }">

    <entries-grid
      :items="[
        {
          pito: 'my-documents',
          name: 'Who Am I?',
          to: { name: 'resume.who-am-i' },
        },
      ]"
      class="text-inverted"
    />

    <slot />

    <div
      class="
        absolute bottom-0 inset-x-0 h-10
        flex items-center gap-3
        bg-[#2262dd]
      ">

      <div
        class="
          h-full
          bg-[#20911d]
          rounded-e-xl
          ps-6 pe-8 py-3
          flex items-center
          cursor-pointer select-none
          hover:bg-[#1f7b17]
          active:bg-[#1b6c15]
          drop-shadow-[1px_0_2px_rgba(0,0,0,0.5)]
        ">

        <span class="text-xl text-inverted font-semibold drop-shadow-[2px_2px_1px_black]">
          start
        </span>

      </div>

      <div class="grow" />

      <span class="text-sm text-inverted pe-3">
        <client-only>
          {{ new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }}
        </client-only>
      </span>

    </div>

  </div>
</template>
