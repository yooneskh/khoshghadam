

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'token': 'string',
  'expiresAt': 'number',
  'isActive': 'boolean',
});


declare module 'h3' {
  interface H3EventContext {
    authenticationTokens: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineEventHandler(event => {
  event.context.authenticationTokens = {
    dbo: createUnifiedResourceController({
      event,
      resource: 'authenticationTokens',
      schema,
      type,
    }),
  };
});
