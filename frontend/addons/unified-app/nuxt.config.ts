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
    '@nuxtjs/sitemap',
    'nuxt-jsonld',
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

  'nuxt-jsonld': {
    disableOptionsAPI: true,
  },

  extends: [
    '../unified-form',
    '../unified-dialog',
    '../unified-toast',
    '../unified-network',
  ],

});
