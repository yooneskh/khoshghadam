
/* responsibility */

// Creates an omani idea vote
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.create',
  });
});
