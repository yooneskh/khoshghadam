
/* responsibility */

// Registers the media resource
// and its storage directory
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'owner': 'string',
  'name': 'string',
  'type': 'string',
  'size': 'number',
  'path': 'string',
  'variants?': 'Record<string, string>',
});


declare global {
  interface UnifiedAppRegistry {
    media: {
      directory: string;
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.media = {
    directory: `${process.cwd()}/.data/media`,
    dbo: createUnifiedResourceController({
      resource: 'media',
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
