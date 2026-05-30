

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'authorizationTokens',
    event,
    // permission: 'admin.authorization-tokens.retrieve',
  });
});
