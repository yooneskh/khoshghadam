

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'username': 'string',
});


declare global {
  interface UnifiedResourcesRegistry {
    users: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.users = {
    dbo: createUnifiedResourceController({
      resource: 'users',
      schema,
      type,
    }),
  };
});
