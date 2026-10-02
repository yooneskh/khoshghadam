
/* responsibility */

// Deletes a media document
// and erases its stored files for admins.


export default defineEventHandler(async event => {

  const media = await handleResourceDelete({
    resource: 'media',
    event,
    permission: 'admin.media.delete',
  });


  return eraseMedia(media._id);

});
