

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.create',
  });
});
