

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'omaniIdeaComments',
    event,
    permission: 'admin.omani-idea-comments.create',
  });
});
