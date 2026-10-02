
/* responsibility */

// Lists user API keys
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.list',
  });
});
