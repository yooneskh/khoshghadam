/* responsibility */

// Returns the media settings singleton schema
// to admins.


export default defineEventHandler(async event => {
  return handleSingletonSchema({
    resource: 'mediaSettings',
    event,
    permission: 'admin.media-settings.schema',
  });
});
