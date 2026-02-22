import { type } from 'arktype';


const flashCard = type({
  'owner': 'string > 0',
  'tags': '(string > 0)[]',
  'cards': type({
    'frontText': 'string > 0',
    'backText': 'string > 0',
  }).array().atLeastLength(1),
});


declare module 'h3' {
  interface H3EventContext {
    flashCards: UnifiedResourceController<typeof flashCard.infer>;
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.flashCards = createUnifiedResourceController({
      event,
      collectionName: 'flashCards',
      type: flashCard,
    });
  });
});
