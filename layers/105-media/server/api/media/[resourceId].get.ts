
/* responsibility */

// Retrieves one media document
// for admins.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'media',
    event,
    permission: 'admin.media.retrieve',
  });
});
