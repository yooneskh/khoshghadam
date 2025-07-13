

export default defineNuxtConfig({

  future: { compatibilityVersion: 4 },
  devtools: { enabled: false },

  experimental: {
    typedPages: true,
  },

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-radash',
  ],

  css: [
    '~/domains/aarde/app/assets/css/layout.css',
  ],

  ui: {
    colorMode: false,
  },

  radash: {
    prefix: 'rad',
  },

  extends: [
    '../unified-form',
    '../unified-dialog',
    '../unified-toast',
    '../unified-network',
  ],

});
