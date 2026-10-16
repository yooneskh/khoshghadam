
/* responsibility */

// Returns one webagram post
// for admins.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'webagramPosts',
    event,
    permission: 'admin.webagram-posts.retrieve',
  });
});
