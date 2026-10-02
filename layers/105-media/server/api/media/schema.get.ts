
/* responsibility */

// Returns the media resource schema
// to admins.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'media',
    event,
    permission: 'admin.media.schema',
  });
});
