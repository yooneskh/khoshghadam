
/* responsibility */

// Returns one user API key by id
// for admins with retrieve permission.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.retrieve',
  });
});
