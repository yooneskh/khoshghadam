
/* responsibility */

// Registers the media settings singleton
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'userMaxUploadSize': 'number',
});


declare global {
  interface UnifiedAppRegistry {
    mediaSettings: {
      dbo: UnifiedSingletonController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.mediaSettings = {
    dbo: createUnifiedSingletonController({
      resource: 'mediaSettings',
      schema,
      type,
      defaults: {
        userMaxUploadSize: 100,
      },
    }),
  };
});
