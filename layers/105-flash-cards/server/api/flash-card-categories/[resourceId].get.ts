

export default defineEventHandler(async event => {
  return event.context.flashCardCategories.retrieve({
    resourceId: getRouterParam(event, 'resourceId'),
  });
});
