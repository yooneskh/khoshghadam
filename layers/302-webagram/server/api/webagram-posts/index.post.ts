
/* responsibility */

// Creates a webagram post
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'webagramPosts',
    event,
    permission: 'admin.webagram-posts.create',
  });
});
