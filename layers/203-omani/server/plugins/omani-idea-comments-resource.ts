

const { schema, type, inferred } = parseSchema({
  'idea': 'string',
  'author': 'string',
  'body': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    omaniIdeaComments: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.omaniIdeaComments = {
    dbo: createUnifiedResourceController({
      resource: 'omaniIdeaComments',
      schema,
      type,
      meta: {
        idea: {
          resource: 'omaniIdeas',
        },
        author: {
          resource: 'users',
        },
        body: {
          longText: true,
        },
      },
      indexes: [
        {
          key: { idea: 1, createdAt: 1 },
        },
      ],
    }),
  };
});
