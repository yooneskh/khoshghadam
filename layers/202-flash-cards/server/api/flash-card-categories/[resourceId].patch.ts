
/* responsibility */

// Updates a flash card category
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.update',
  });
});
