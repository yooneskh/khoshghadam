
/* responsibility */

// Deletes one webagram page
// for admins.


export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'webagramPages',
    event,
    permission: 'admin.webagram-pages.delete',
  });
});
