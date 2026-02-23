

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'flashCardCategories',
    event,
  });
});
