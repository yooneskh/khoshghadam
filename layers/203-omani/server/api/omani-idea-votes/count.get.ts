
/* responsibility */

// Counts omani idea votes
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.count',
  });
});
