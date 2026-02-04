import { type } from 'arktype';


const user = type({
  'username': 'string',
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
