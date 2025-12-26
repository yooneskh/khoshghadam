import { pathRelativeToBase } from 'nuxt-unified-ui';


export default defineNuxtConfig({

  css: [
    pathRelativeToBase(import.meta.url, './app/assets/css/main.css'),
  ],

  modules: [
    'nuxt-gtag',
    'nuxt-jsonld',
  ],

  gtag: {
    id: 'G-P80YWT2RDF',
  },

  extends: [
    'nuxt-unified-ui',
  ],

});
