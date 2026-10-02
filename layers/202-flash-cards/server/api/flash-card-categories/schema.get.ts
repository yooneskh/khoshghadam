
/* responsibility */

// Returns the flash card category
// resource schema for admins.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.schema',
  });
});
