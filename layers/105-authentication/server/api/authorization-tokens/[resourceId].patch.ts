

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'authorizationTokens',
    event,
    // permission: 'admin.authorization-tokens.update',
  });
});
