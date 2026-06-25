

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'type': 'string',
  'size': 'number',
  'path': 'string',
  'variants?': 'Record<string, string>'
});


declare module 'h3' {
  interface H3EventContext {
    media: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineEventHandler(event => {
  event.context.media = {
    dbo: createUnifiedResourceController({
      event,
      resource: 'media',
      schema,
      type,
    }),
  };
});
