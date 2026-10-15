
/* responsibility */

// Registers the businesses resource
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'owner': 'string',
  'slug': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    businesses: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.businesses = {
    dbo: createUnifiedResourceController({
      resource: 'businesses',
      schema,
      type,
      meta: {
        owner: {
          resource: 'users',
        },
      },
    }),
  };
});
