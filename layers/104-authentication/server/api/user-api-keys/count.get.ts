
/* responsibility */

// Counts user API keys
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.count',
  });
});
