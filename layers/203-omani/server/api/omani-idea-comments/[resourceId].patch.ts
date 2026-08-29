

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.update',
  });
});
