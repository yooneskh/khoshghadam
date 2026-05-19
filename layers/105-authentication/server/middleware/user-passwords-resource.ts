

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'passwordHash': 'string',
  'isActive': 'boolean',
});


declare module 'h3' {
  interface H3EventContext {
    userPasswords: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineEventHandler(event => {
  event.context.userPasswords = {
    dbo: createUnifiedResourceController({
      event,
      resource: 'userPasswords',
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
