

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.delete',
  });
});
