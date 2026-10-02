
/* responsibility */

// Deletes a flash card category
// for admins.


export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.delete',
  });
});
