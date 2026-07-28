

export default defineEventHandler(async event => {

  const media = await handleResourceDelete({
    resource: 'media',
    event,
    permission: 'admin.media.delete',
  });


  return eraseMedia(media._id);

});
