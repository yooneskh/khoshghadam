import { join } from 'node:path';


const { schema, type, inferred } = parseSchema({
  'owner': 'string',
  'name': 'string',
  'type': 'string',
  'size': 'number',
  'path': 'string',
  'variants?': 'Record<string, string>',
});


declare global {
  interface UnifiedAppRegistry {
    media: {
      directory: string;
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.media = {
    directory: join(process.cwd(), '.data/media'),
    dbo: createUnifiedResourceController({
      resource: 'media',
      schema,
      type,
      meta: {
        owner: {
          resource: 'users',
        },
      },
    }),
  };
});
