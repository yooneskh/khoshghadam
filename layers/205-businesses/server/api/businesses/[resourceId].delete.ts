
/* responsibility */

// Deletes one business
// for admins.


export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'businesses',
    event,
    permission: 'admin.businesses.delete',
  });
});
