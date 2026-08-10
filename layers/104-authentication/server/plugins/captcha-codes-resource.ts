

const { schema, type, inferred } = parseSchema({
  'code': 'string',
  'isActive': 'boolean',
  'expiresAt': 'number',
});


declare global {
  interface UnifiedAppRegistry {
    captchaCodes: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.captchaCodes = {
    dbo: createUnifiedResourceController({
      resource: 'captchaCodes',
      schema,
      type,
      meta: {
        expiresAt: {
          labelFormat: 'default',
        },
      },
    }),
  };
});
