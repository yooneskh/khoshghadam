

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'body?': 'string',
  'author': 'string',
  'status': "'published' | 'hidden'",
  'voteCount': 'number',
  'commentCount': 'number',
  'featuredOn?': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    omaniIdeas: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.omaniIdeas = {
    dbo: createUnifiedResourceController({
      resource: 'omaniIdeas',
      schema,
      type,
      meta: {
        author: {
          resource: 'users',
        },
        body: {
          longText: true,
          hideInTable: true,
        },
        status: {
          enum: [
            {
              label: 'Published',
              value: 'published',
            },
            {
              label: 'Hidden',
              value: 'hidden',
            },
          ],
        },
      },
      indexes: [
        {
          key: {
            featuredOn: 1,
          },
          unique: true,
          sparse: true,
        },
        {
          key: {
            status: 1,
            voteCount: -1,
          },
        },
        {
          key: {
            status: 1,
            createdAt: -1,
          },
        },
      ],
    }),
  };
});
