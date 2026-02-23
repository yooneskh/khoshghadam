

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCardCategories',
    event,
  });
});
