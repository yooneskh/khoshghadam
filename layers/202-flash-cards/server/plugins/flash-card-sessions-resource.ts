
/* responsibility */

// Registers the flash card sessions resource
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'flashCard': 'string',
  'user': 'string',
  'answeredCards': [{
    'card': 'string',
    'opened': 'boolean',
  }, '[]'],
  'finishedAt?': 'number',
  'successful?': 'boolean',
});


declare global {
  interface UnifiedAppRegistry {
    flashCardSessions: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.flashCardSessions = {
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
        finishedAt: {
          labelFormat: 'default',
        },
      },
    }),
  };
});
