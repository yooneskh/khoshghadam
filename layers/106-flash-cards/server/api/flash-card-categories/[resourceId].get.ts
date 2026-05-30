

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCardCategories',
    event,
    // permission: 'admin.flash-card-categories.retrieve',
  });
});
