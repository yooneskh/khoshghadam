
/* responsibility */

// Returns one authorization token by id
// for admins with the retrieve permission.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'authorizationTokens',
    event,
    permission: 'admin.authorization-tokens.retrieve',
  });
});
