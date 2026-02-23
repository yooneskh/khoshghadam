

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCardCategories',
    event,
  });
});
