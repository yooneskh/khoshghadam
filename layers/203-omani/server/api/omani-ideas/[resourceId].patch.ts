
/* responsibility */

// Updates an omani idea
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.update',
  });
});
