

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.list',
  });
});
