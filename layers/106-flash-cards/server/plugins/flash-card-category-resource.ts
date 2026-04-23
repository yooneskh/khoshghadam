

const { schema, type, inferred } = parseSchema({
  'name': 'string > 0',
});


declare module 'h3' {
  interface H3EventContext {
    flashCardCategories: {
      dbo: UnifiedResourceController<typeof inferred>;
    }
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.flashCardCategories = {
      dbo: createUnifiedResourceController({
        event,
        collectionName: 'flashCardCategories',
        schema,
        type,
      }),
    };
  });
});
