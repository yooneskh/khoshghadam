

export default defineNuxtConfig({

  routeRules: {
    '/dashboard/**': {
      ssr: false,
    },
  },

});
