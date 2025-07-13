<script setup>

const config = useAppConfig();


/* seo */

useHead({
  titleTemplate: t => `${t ? `${t} - ` : ''}${config.brand.title}`,
});

useSeoMeta({
  'description': 'My fullstack platform made with Vue, Nuxt and Bun',
});

</script>


<template>
  <u-app
    :tooltip="{
      delayDuration: 0,
    }">

    <nuxt-route-announcer />

    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>

  </u-app>
</template>
