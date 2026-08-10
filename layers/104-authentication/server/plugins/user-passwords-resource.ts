

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'passwordHash': 'string',
  'isActive': 'boolean',
});


declare global {
  interface UnifiedAppRegistry {
    userPasswords: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.userPasswords = {
    dbo: createUnifiedResourceController({
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
