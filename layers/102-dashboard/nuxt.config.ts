
/* responsibility */

// Configures the dashboard layer
// to render its pages client-side only.


export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': {
      ssr: false,
    },
  },
});
