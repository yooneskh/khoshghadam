

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'type': 'string',
  'size': 'number',
  'path': 'string',
  'variants?': 'Record<string, string>'
});


declare global {
  interface UnifiedResourcesRegistry {
    media: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.media = {
    dbo: createUnifiedResourceController({
      resource: 'media',
      schema,
      type,
    }),
  };
});
