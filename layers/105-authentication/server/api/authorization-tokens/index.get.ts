

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'authorizationTokens',
    event,
    // permission: 'admin.authorization-tokens.list',
  });
});
