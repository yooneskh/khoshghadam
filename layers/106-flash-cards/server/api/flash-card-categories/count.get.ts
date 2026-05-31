

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.count',
  });
});
