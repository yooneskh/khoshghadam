
/* responsibility */

// Retrieves one omani idea comment
// for admins.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.retrieve',
  });
});
