

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCardCategories',
    event,
  });
});
