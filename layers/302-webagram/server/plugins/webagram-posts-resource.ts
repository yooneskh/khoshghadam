
/* responsibility */

// Registers the webagram posts resource
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'page': 'string',
  'owner': 'string',
  'slides': 'string[]',
  'description': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    webagramPosts: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.webagramPosts = {
    dbo: createUnifiedResourceController({
      resource: 'webagramPosts',
      schema,
      type,
      meta: {
        page: {
          resource: 'webagramPages',
        },
        owner: {
          resource: 'users',
        },
        slides: {
          resource: 'media',
        },
      },
    }),
  };
});
