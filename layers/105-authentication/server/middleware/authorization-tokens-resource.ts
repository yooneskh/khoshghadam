

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'permissions': 'string[]',
  'roles?': 'string[]',
});


declare module 'h3' {
  interface H3EventContext {
    authorizationTokens: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineEventHandler(event => {
  event.context.authorizationTokens = {
    dbo: createUnifiedResourceController({
      event,
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
