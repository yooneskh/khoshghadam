import { type } from 'arktype';


const authenticationToken = type({
  'user': 'string',
  'token': 'string',
  'expiresAt': 'number',
  'isActive': 'boolean',
});


declare module 'h3' {
  interface H3EventContext {
    authenticationTokens: {
      dbo: UnifiedResourceController<typeof authenticationToken.infer>;
    };
  }
}


export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    event.context.authenticationTokens = {
      dbo: createUnifiedResourceController({
        event,
        collectionName: 'authenticationTokens',
        type: authenticationToken,
      }),
    };
  });
});
