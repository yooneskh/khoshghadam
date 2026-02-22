

export default defineEventHandler(async event => {
  return event.context.flashCardCategories.delete({
    resourceId: getRouterParam(event, 'resourceId'),
  });
});
