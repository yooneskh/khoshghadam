
/* responsibility */

// Registers the omani idea votes resource
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'idea': 'string',
  'user': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    omaniIdeaVotes: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.omaniIdeaVotes = {
    dbo: createUnifiedResourceController({
      resource: 'omaniIdeaVotes',
      schema,
      type,
      meta: {
        idea: {
          resource: 'omaniIdeas',
        },
        user: {
          resource: 'users',
        },
      },
      indexes: [
        {
          key: {
            idea: 1,
            user: 1,
          },
          unique: true,
        },
      ],
    }),
  };
});
