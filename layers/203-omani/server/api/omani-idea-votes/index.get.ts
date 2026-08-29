

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'omaniIdeaVotes',
    event,
    permission: 'admin.omani-idea-votes.list',
  });
});
