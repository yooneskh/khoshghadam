
/* responsibility */

// Retrieves a single user
// for admins.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'users',
    event,
    permission: 'admin.users.retrieve',
  });
});
