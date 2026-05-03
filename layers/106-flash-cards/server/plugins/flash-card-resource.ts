

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
        resource: 'flashCards',
        schema,
        type,
        meta: {
          owner: {
            resource: 'users',
          },
          category: {
            resource: 'flashCardCategories',
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
