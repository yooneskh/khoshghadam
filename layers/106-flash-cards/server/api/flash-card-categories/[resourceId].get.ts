

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCardCategories',
    event,
  });
});
