
/* responsibility */

// Lists webagram posts
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'webagramPosts',
    event,
    permission: 'admin.webagram-posts.list',
  });
});
