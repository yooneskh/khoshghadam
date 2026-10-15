
/* responsibility */

// Creates a business
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'businesses',
    event,
    permission: 'admin.businesses.create',
  });
});
