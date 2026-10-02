
/* responsibility */

// Updates one media document
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'media',
    event,
    permission: 'admin.media.update',
  });
});
