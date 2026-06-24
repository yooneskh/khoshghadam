

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.update',
  });
});
