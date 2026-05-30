

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'authorizationTokens',
    event,
    // permission: 'admin.authorization-tokens.delete',
  });
});
