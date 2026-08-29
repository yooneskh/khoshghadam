

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.retrieve',
  });
});
