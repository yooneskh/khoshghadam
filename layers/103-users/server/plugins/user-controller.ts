

declare module 'h3' {
  interface H3EventContext {
    users: UnifiedResourceController;
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.users = createUnifiedResourceController(event, 'users');
  });
});
