

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'token': 'string',
  'expiresAt': 'number',
  'isActive': 'boolean',
});


declare global {
  interface UnifiedAppRegistry {
    authenticationTokens: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.authenticationTokens = {
    dbo: createUnifiedResourceController({
      resource: 'authenticationTokens',
      schema,
      type,
      meta: {
        user: {
          resource: 'users',
        },
      },
    }),
  };
});
