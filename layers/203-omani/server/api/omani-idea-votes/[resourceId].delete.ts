

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.delete',
  });
});
