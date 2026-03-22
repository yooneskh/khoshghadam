import { type } from 'arktype';


const user = type({
  'name': 'string > 0',
  'username': 'string > 0',
  'password': 'string',
});


declare module 'h3' {
  interface H3EventContext {
    users: UnifiedResourceController<typeof user.infer>;
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.users = createUnifiedResourceController({
      event,
      collectionName: 'users',
      type: user,
    });
  });
});
