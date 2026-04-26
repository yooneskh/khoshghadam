

const { schema, type, inferred } = parseSchema({
  'flashCard': 'string',
  'user': 'string',
  'answeredCards': [{
    'card': 'string',
    'opened': 'boolean',
  }, '[]'],
});


declare module 'h3' {
  interface H3EventContext {
    flashCardSessions: {
      dbo: UnifiedResourceController<typeof inferred>;
    }
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.flashCardSessions = {
      dbo: createUnifiedResourceController({
        event,
        collectionName: 'flashCardSessions',
        schema,
        type,
        meta: {
          flashCard: {
            ref: 'FlashCard',
          },
          user: {
            ref: 'User',
          },
        },
      }),
    };
  });
});
