
/* responsibility */

// Retrieves one flash card category
// for admins.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.retrieve',
  });
});
