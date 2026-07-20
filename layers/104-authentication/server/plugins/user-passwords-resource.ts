

const { schema, type, inferred } = parseSchema({
  'user': 'string',
  'passwordHash': 'string',
  'isActive': 'boolean',
});


declare global {
  interface UnifiedResourcesRegistry {
    userPasswords: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.userPasswords = {
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
