

const { schema, type, inferred } = parseSchema({
  'flashCard': 'string',
  'user': 'string',
  'answeredCards': [{
    'card': 'string',
    'opened': 'boolean',
  }, '[]'],
});


declare module 'h3' {
  interface H3EventContext {
    flashCardSessions: {
      dbo: UnifiedResourceController<typeof inferred>;
    }
  }
}


export default defineEventHandler(event => {
  event.context.flashCardSessions = {
    dbo: createUnifiedResourceController({
      event,
      resource: 'flashCardSessions',
      schema,
      type,
      meta: {
        flashCard: {
          resource: 'flashCards',
        },
        user: {
          resource: 'users',
        },
      },
    }),
  };
});
