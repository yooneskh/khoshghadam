
/* responsibility */

// Returns the omani idea comments schema
// for admins.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.schema',
  });
});
