
/* responsibility */

// Counts webagram pages
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'webagramPages',
    event,
    permission: 'admin.webagram-pages.count',
  });
});
