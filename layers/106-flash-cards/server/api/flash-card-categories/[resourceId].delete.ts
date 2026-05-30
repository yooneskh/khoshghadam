

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'flashCardCategories',
    event,
    // permission: 'admin.flash-card-categories.delete',
  });
});
