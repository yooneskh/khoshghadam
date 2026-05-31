

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'authorizationTokens',
    event,
    permission: 'admin.authorization-tokens.count',
  });
});
