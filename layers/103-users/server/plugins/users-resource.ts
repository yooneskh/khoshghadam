

const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'username': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    users: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.users = {
    dbo: createUnifiedResourceController({
      resource: 'users',
      schema,
      type,
    }),
  };
});
