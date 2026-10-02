
/* responsibility */

// Deletes a user API key
// for admins.


export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.delete',
  });
});
