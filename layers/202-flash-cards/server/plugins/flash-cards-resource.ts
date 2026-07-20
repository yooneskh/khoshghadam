

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'slug': 'string',
  'owner': 'string',
  'category': 'string',
  'description': 'string',
  'tags?': 'string[]',
  'cards': [{
    'frontText': 'string',
    'backText': 'string',
  }, '[]'],
});


declare global {
  interface UnifiedResourcesRegistry {
    flashCards: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.flashCards = {
    dbo: createUnifiedResourceController({
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
        description: {
          hideInTable: true,
        },
        cards: {
          children: {
            backText: {
              longText: true,
            },
          },
        },
      },
    }),
  };
});
