
/* responsibility */

// Lists flash card categories
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.list',
  });
});
