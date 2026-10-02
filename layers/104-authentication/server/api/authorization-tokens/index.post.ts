
/* responsibility */

// Creates an authorization token
// for admins with the create permission.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'authorizationTokens',
    event,
    permission: 'admin.authorization-tokens.create',
  });
});
