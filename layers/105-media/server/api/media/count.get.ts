

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'media',
    event,
    permission: 'admin.media.count',
  });
});
