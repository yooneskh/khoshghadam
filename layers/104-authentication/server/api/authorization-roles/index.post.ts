
/* responsibility */

// Creates an authorization role
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'authorizationRoles',
    event,
    permission: 'admin.authorization-roles.create',
  });
});
