
/* responsibility */

// Registers the webagram pages resource
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'business': 'string',
  'slug': 'string',
  'image': 'string',
  'description': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    webagramPages: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.webagramPages = {
    dbo: createUnifiedResourceController({
      resource: 'webagramPages',
      schema,
      type,
      meta: {
        business: {
          resource: 'businesses',
        },
        image: {
          resource: 'media',
        },
      },
    }),
  };
});
