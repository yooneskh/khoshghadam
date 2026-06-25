

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'media',
    event,
    permission: 'admin.media.schema',
  });
});
