

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'authorizationTokens',
    event,
    permission: 'admin.authorization-tokens.create',
  });
});
