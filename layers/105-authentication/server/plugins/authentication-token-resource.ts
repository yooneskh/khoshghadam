

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


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.authenticationTokens = {
      dbo: createUnifiedResourceController({
        event,
        collectionName: 'authenticationTokens',
        schema,
        type,
      }),
    };
  });
});
