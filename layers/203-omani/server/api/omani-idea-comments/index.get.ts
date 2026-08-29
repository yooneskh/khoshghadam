

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.list',
  });
});
