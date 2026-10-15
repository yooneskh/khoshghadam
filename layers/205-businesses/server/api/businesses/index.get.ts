
/* responsibility */

// Lists businesses
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'businesses',
    event,
    permission: 'admin.businesses.list',
  });
});
