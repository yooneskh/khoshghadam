/* responsibility */

// Updates the media settings singleton
// for admins.


export default defineEventHandler(async event => {
  return handleSingletonUpdate({
    resource: 'mediaSettings',
    event,
    permission: 'admin.media-settings.update',
  });
});
