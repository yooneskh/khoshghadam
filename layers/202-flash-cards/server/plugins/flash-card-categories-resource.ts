

const { schema, type, inferred } = parseSchema({
  'name': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    flashCardCategories: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.flashCardCategories = {
    dbo: createUnifiedResourceController({
      resource: 'flashCardCategories',
      schema,
      type,
    }),
  };
});
