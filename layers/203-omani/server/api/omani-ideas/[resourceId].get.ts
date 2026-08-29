

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.retrieve',
  });
});
