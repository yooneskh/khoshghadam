import { type as arkType } from 'arktype';


const { schema, type, inferred } = parseSchema({
  'owner': 'string > 0',
  'tags': '(string > 0)[]',
  'cards': arkType({
    'frontText': 'string > 0',
    'backText': 'string > 0',
  }).array().atLeastLength(1),
});


declare module 'h3' {
  interface H3EventContext {
    flashCards: {
      dbo: UnifiedResourceController<typeof inferred>;
    };
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.flashCards = {
      dbo: createUnifiedResourceController({
        event,
        collectionName: 'flashCards',
        schema,
        type,
        meta: {
          owner: {
            ref: 'User',
          },
        },
      }),
    };
  });
});
