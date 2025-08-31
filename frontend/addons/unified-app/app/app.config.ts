

export default defineAppConfig({
  ui: {

    button: {
      defaultVariants: {
        color: 'neutral',
      },
      slots: {
        base: 'cursor-pointer',
      },
    },

    badge: {
      defaultVariants: {
        color: 'neutral',
      },
    },

    card: {
      slots: {
        body: 'p-3 sm:p-3',
      },
    },

  },
});
