

export default defineNuxtConfig({

  compatibilityDate: 'latest',

  site: {
    url: 'https://khoshghadam.com',
    name: 'Khoshghadam',
  },

  extends: [
    './domains/public',
    './domains/aarde',
    './addons/unified-app',
  ],

});
