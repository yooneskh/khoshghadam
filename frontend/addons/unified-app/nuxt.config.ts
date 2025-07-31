import { normalizePathToCwd } from './app/utils/normalize-path';


export default defineNuxtConfig({

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
    normalizePathToCwd(import.meta.url, './app/assets/css/layout.css'),
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
