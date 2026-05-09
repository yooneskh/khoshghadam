

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'username': 'string',
  'password': 'string',
});


declare module 'h3' {
  interface H3EventContext {
    users: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.users = {
      dbo: createUnifiedResourceController({
        event,
        resource: 'users',
        schema,
        type,
        meta: {
          password: {
            hidden: true,
          },
        },
      }),
    };
  });
});
