import { pathRelativeToBase } from 'nuxt-unified-ui';


export default defineNuxtConfig({
  extends: [
    'nuxt-unified-ui',
  ],
  modules: [
    'nuxt-gtag',
    'nuxt-jsonld',
    '@nuxtjs/sitemap',
  ],
  css: [
    pathRelativeToBase(import.meta.url, './app/assets/css/main.css'),
  ],
  gtag: {
    id: import.meta.dev ? undefined : 'G-P80YWT2RDF',
  },
  sitemap: {
    exclude: [
      '/dashboard/**',
    ],
    sources: [
      '/api/sitemap-urls',
    ],
  },
});
