

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.retrieve',
  });
});
