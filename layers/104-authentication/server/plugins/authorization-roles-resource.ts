

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'permissions': 'string[]',
});


declare global {
  interface UnifiedResourcesRegistry {
    authorizationRoles: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.authorizationRoles = {
    dbo: createUnifiedResourceController({
      resource: 'authorizationRoles',
      schema,
      type,
    }),
  };
});
