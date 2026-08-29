

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.count',
  });
});
