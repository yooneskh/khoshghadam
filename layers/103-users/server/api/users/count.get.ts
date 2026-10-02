
/* responsibility */

// Counts users
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'users',
    event,
    permission: 'admin.users.count',
  });
});
