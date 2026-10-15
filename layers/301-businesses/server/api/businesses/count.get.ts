
/* responsibility */

// Counts businesses
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'businesses',
    event,
    permission: 'admin.businesses.count',
  });
});
