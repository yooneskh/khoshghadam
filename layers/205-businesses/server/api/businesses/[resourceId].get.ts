
/* responsibility */

// Returns a single business
// for admins with retrieve access.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'businesses',
    event,
    permission: 'admin.businesses.retrieve',
  });
});
