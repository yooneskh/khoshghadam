
/* responsibility */

// Returns the businesses resource schema
// for admins with schema permission.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'businesses',
    event,
    permission: 'admin.businesses.schema',
  });
});
