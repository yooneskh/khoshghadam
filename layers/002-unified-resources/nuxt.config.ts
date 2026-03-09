

export default defineNuxtConfig({

  routeRules: {
    '/resources/*': {
      ssr: false,
    },
  },

});
