

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCardCategories',
    event,
  });
});
