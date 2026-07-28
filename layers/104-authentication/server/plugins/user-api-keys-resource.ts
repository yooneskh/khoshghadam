

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'owner': 'string',
  'apiKey': 'string',
  'permissions?': 'string[]',
  'roles?': 'string[]',
  'isActive': 'boolean',
  'expiresAt': 'number',
});


declare global {
  interface UnifiedResourcesRegistry {
    userApiKeys: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.userApiKeys = {
    dbo: createUnifiedResourceController({
      resource: 'userApiKeys',
      schema,
      type,
      meta: {
        owner: {
          resource: 'users',
        },
        roles: {
          resource: 'authorizationRoles',
        },
        expiresAt: {
          labelFormat: true,
        },
      },
    }),
  };
});
