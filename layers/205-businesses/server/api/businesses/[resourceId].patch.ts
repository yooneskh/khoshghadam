
/* responsibility */

// Updates one business
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'businesses',
    event,
    permission: 'admin.businesses.update',
  });
});
