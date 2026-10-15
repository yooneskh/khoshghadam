
/* responsibility */

// Returns a single webagram page
// for admins with retrieve access.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'webagramPages',
    event,
    permission: 'admin.webagram-pages.retrieve',
  });
});
