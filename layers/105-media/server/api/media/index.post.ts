
/* responsibility */

// Creates a media record
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'media',
    event,
    permission: 'admin.media.create',
  });
});
