

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCardCategories',
    event,
  });
});
