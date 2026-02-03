import { type } from 'arktype';


declare module 'h3' {
  interface H3EventContext {
    users: UnifiedResourceController<typeof user.infer>;
  }
}


const user = type({
  'username': 'string',
  'password': 'string',
});


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.users = createUnifiedResourceController({
      event,
      collectionName: 'users',
      type: user,
    });
  });
});
