

const { schema, type, inferred } = parseSchema({
  'name': 'string',
});


declare module 'h3' {
  interface H3EventContext {
    flashCardCategories: {
      dbo: UnifiedResourceController<typeof inferred>;
    }
  }
}


export default defineEventHandler(event => {
  event.context.flashCardCategories = {
    dbo: createUnifiedResourceController({
      event,
      resource: 'flashCardCategories',
      schema,
      type,
    }),
  };
});
