
/* responsibility */

// Deletes a media document
// and erases its stored files for admins.


export default defineEventHandler(async event => {

  await assertUserPermission({
    event,
    permission: 'admin.media.delete',
  });


  return eraseMedia(getRouterParam(event, 'resourceId'));

});
