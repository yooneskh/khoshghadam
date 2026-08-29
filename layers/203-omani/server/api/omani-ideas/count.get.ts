

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.count',
  });
});
