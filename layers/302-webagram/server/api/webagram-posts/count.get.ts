
/* responsibility */

// Counts webagram posts
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'webagramPosts',
    event,
    permission: 'admin.webagram-posts.count',
  });
});
