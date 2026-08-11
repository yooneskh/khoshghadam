

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'slug': 'string',
  'description': 'string',
  'steps': [{
    'flashCard': 'string',
  }, '[]'],
});


declare global {
  interface UnifiedAppRegistry {
    flashCardJourneys: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.flashCardJourneys = {
    dbo: createUnifiedResourceController({
      resource: 'flashCardJourneys',
      schema,
      type,
      meta: {
        description: {
          hideInTable: true,
          longText: true,
        },
        steps: {
          children: {
            flashCard: {
              resource: 'flashCards',
            },
          },
        },
      },
    }),
  };
});
