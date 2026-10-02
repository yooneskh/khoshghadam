
/* responsibility */

// Returns a single omani idea
// for admins with retrieve access.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'omaniIdeas',
    event,
    permission: 'admin.omani-ideas.retrieve',
  });
});
