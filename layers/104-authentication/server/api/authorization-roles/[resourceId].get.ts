
/* responsibility */

// Retrieves one authorization role
// for admins.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'authorizationRoles',
    event,
    permission: 'admin.authorization-roles.retrieve',
  });
});
