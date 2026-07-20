

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'permissions': 'string[]',
  'roles?': 'string[]',
});


declare global {
  interface UnifiedResourcesRegistry {
    authorizationTokens: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.authorizationTokens = {
    dbo: createUnifiedResourceController({
      resource: 'authorizationTokens',
      schema,
      type,
      meta: {
        user: {
          resource: 'users',
        },
        roles: {
          resource: 'authorizationRoles',
        },
      },
    }),
  };
});
