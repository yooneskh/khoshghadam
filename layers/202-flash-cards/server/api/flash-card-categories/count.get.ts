
/* responsibility */

// Counts flash card categories
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.count',
  });
});
