

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCardCategories',
    event,
    permission: 'admin.flash-card-categories.create',
  });
});
