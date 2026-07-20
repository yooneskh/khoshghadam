

const { schema, type, inferred } = parseSchema({
  'flashCard': 'string',
  'user': 'string',
  'answeredCards': [{
    'card': 'string',
    'opened': 'boolean',
  }, '[]'],
});


declare global {
  interface UnifiedResourcesRegistry {
    flashCardSessions: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.flashCardSessions = {
    dbo: createUnifiedResourceController({
      resource: 'flashCardSessions',
      schema,
      type,
      meta: {
        flashCard: {
          resource: 'flashCards',
        },
        user: {
          resource: 'users',
        },
      },
    }),
  };
});
