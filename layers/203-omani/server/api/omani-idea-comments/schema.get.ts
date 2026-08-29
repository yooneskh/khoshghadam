

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.schema',
  });
});
