import { type } from 'arktype';


const flashCardCategory = type({
  'name': 'string > 0',
});


declare module 'h3' {
  interface H3EventContext {
    flashCardCategories: UnifiedResourceController<typeof flashCardCategory.infer>;
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.flashCardCategories = createUnifiedResourceController({
      event,
      collectionName: 'flashCardCategories',
      type: flashCardCategory,
    });
  });
});
