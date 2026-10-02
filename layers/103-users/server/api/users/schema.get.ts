
/* responsibility */

// Returns the users resource schema
// to admins.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'users',
    event,
    permission: 'admin.users.schema',
  });
});
