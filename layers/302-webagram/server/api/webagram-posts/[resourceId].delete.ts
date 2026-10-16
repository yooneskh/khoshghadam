
/* responsibility */

// Deletes one webagram post
// for admins.


export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'webagramPosts',
    event,
    permission: 'admin.webagram-posts.delete',
  });
});
