
/* responsibility */

// Lists webagram pages
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'webagramPages',
    event,
    permission: 'admin.webagram-pages.list',
  });
});
