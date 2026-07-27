

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'token': 'string',
  'expiresAt': 'number',
  'isActive': 'boolean',
});


declare global {
  interface UnifiedResourcesRegistry {
    authenticationTokens: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.authenticationTokens = {
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
