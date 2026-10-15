
/* responsibility */

// Updates one webagram page
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'webagramPages',
    event,
    permission: 'admin.webagram-pages.update',
  });
});
