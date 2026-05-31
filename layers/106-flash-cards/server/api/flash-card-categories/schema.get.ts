

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.schema',
  });
});
