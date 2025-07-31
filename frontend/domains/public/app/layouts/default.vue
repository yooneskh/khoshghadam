<script setup>

import BackgroundImage from '../assets/images/desktop-background.jpg';

</script>


<template>
  <div
    class="
      h-[100dvh] w-screen
      bg-cover bg-center
      relative
    "
    :style="{
      backgroundImage: `url(${BackgroundImage})`
    }">

    <applications-grid />

    <slot />

    <div
      class="
        absolute bottom-0 left-0 right-0 h-10
        flex items-center gap-3 pe-3
        bg-[#2262dd]
      ">

      <div
        class="
          h-full
          bg-[#20911d]
          rounded-e-xl
          ps-3 pe-5 py-3
          flex items-center
          transition cursor-pointer select-none
          hover:bg-[#1f7b17]
          active:bg-[#1b6c15]
          drop-shadow-[1px_0_2px_rgba(0,0,0,0.5)]
        ">

        <span class="text-white text-xl font-black drop-shadow-[2px_2px_1px_black]">
          start
        </span>

      </div>

      <div class="grow" />

      <span class="text-white text-sm">
        {{ new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }}
      </span>
      
    </div>

  </div>
</template>
