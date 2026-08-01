<script setup>

import BackgroundImage from '~/assets/images/background.jpg';

</script>


<template>
  <div
    class="
      h-dvh w-screen
      relative
      bg-center bg-cover
    "
    :style="{
      backgroundImage: `url(${BackgroundImage})`
    }">

    <entries-grid
      :items="[
        {
          pito: 'my-documents',
          name: 'Who Am I?',
          to: {
            name: 'static-content.resume',
          },
        },
        {
          pito: 'address-book',
          name: 'Learning Center',
          to: {
            name: 'desktop.learning-center',
          },
        },
        {
          pito: 'briefcase',
          name: 'Account Details',
          to: {
            name: 'authentication.account',
          },
        },
      ]"
      class="text-inverted"
    />

    <slot />

    <div
      class="
        absolute bottom-0 inset-x-0
        flex items-center gap-3
        bg-primary
      ">

      <u-button
        variant="soft"
        label="Begin"
        class="font-bold rounded-s-none bg-green-600 text-white px-6"
      />

      <div class="grow" />

      <span class="text-sm text-inverted pe-3">
        <client-only>
          {{ new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }}
        </client-only>
      </span>

    </div>

  </div>
</template>
