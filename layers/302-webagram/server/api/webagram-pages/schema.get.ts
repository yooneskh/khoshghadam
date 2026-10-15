
/* responsibility */

// Returns the webagram pages resource schema
// for admins with schema permission.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'webagramPages',
    event,
    permission: 'admin.webagram-pages.schema',
  });
});
