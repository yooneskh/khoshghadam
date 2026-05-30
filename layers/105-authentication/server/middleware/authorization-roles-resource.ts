

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'permissions': 'string[]',
});


declare module 'h3' {
  interface H3EventContext {
    authorizationRoles: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineEventHandler(event => {
  event.context.authorizationRoles = {
    dbo: createUnifiedResourceController({
      event,
      resource: 'authorizationRoles',
      schema,
      type,
    }),
  };
});
