

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.count',
  });
});
