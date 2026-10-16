
/* responsibility */

// Updates one webagram post
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'webagramPosts',
    event,
    permission: 'admin.webagram-posts.update',
  });
});
