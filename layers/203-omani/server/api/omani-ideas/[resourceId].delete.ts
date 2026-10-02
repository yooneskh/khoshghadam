
/* responsibility */

// Deletes an omani idea
// for admins.


export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.delete',
  });
});
