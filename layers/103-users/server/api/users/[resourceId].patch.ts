
/* responsibility */

// Updates one user
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'users',
    event,
    permission: 'admin.users.update',
  });
});
