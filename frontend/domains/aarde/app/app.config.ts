

export default defineAppConfig({

  brand: {
    id: 'khoshghadam',
    title: 'Yoones',
  },

  ui: {

    colors: {
      primary: 'sky',
      neutral: 'zinc',
    },


    card: {
      slots: {
        body: 'p-3 sm:p-3',
      },
    },

    button: {
      slots: {
        base: 'cursor-pointer',
      },
    },

  },
});
