
/* responsibility */

// Registers the authorization roles resource
// on the unified app registry.


const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'permissions': 'string[]',
});


declare global {
  interface UnifiedAppRegistry {
    authorizationRoles: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.authorizationRoles = {
    dbo: createUnifiedResourceController({
      resource: 'authorizationRoles',
      schema,
      type,
    }),
  };
});
