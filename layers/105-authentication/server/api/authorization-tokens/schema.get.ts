

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'authorizationTokens',
    event,
    // permission: 'admin.authorization-tokens.schema',
  });
});
