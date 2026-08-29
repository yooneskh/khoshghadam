

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.update',
  });
});
