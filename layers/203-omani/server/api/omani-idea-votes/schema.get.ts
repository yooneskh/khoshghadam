
/* responsibility */

// Returns the omani idea votes schema
// for admins.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.schema',
  });
});
