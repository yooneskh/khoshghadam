
/* responsibility */

// Returns the webagram posts resource schema
// for admins with schema permission.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'webagramPosts',
    event,
    permission: 'admin.webagram-posts.schema',
  });
});
