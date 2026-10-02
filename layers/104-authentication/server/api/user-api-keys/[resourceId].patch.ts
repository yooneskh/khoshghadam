
/* responsibility */

// Updates a user API key
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.update',
  });
});
