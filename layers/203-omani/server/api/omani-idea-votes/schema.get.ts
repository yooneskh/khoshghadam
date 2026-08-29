

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.schema',
  });
});
