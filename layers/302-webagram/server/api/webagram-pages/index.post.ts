
/* responsibility */

// Creates a webagram page
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'webagramPages',
    event,
    permission: 'admin.webagram-pages.create',
  });
});
