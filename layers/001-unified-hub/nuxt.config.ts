

export default defineNuxtConfig({

  modules: [
    '@nuxthub/core',
  ],

  hub: {
    db: {
      dialect: 'postgresql',
      driver: 'neon-http',
    },
  },

});
