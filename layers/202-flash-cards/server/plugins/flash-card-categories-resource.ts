

const { schema, type, inferred } = parseSchema({
  'name': 'string',
});


declare global {
  interface UnifiedResourcesRegistry {
    flashCardCategories: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.flashCardCategories = {
    dbo: createUnifiedResourceController({
      resource: 'flashCardCategories',
      schema,
      type,
    }),
  };
});
