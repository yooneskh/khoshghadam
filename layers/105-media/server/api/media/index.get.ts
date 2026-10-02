
/* responsibility */

// Lists media files
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'media',
    event,
    permission: 'admin.media.list',
  });
});
