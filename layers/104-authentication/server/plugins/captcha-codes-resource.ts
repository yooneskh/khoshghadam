

const { schema, type, inferred } = parseSchema({
  'code': 'string',
  'isActive': 'boolean',
  'expiresAt': 'number',
});


declare global {
  interface UnifiedResourcesRegistry {
    captchaCodes: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  resources.captchaCodes = {
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
