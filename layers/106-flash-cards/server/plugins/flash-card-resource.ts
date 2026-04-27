

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'slug': 'string',
  'owner': 'string',
  'category': 'string',
  'tags?': 'string[]',
  'cards': [{
    'frontText': 'string',
    'backText': 'string',
  }, '[]'],
});


declare module 'h3' {
  interface H3EventContext {
    flashCards: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.flashCards = {
      dbo: createUnifiedResourceController({
        event,
        collectionName: 'flashCards',
        schema,
        type,
        meta: {
          owner: {
            ref: 'User',
          },
          category: {
            ref: 'FlashCardCategory',
          },
          cards: {
            children: {
              frontText: {
                width: 6,
              },
              backText: {
                width: 6,
              },
            },
          },
        },
      }),
    };
  });
});
