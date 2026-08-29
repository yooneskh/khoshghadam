

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.schema',
  });
});
