

export default defineNuxtConfig({

  compatibilityDate: 'latest',
  future: { compatibilityVersion: 4 },

  extends: [
    './domains/public',
    './domains/aarde',
    './addons/unified-app',
  ],

});
