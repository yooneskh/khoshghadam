

export default defineEventHandler(async event => {
  return event.context.flashCardCategories.update({
    resourceId: getRouterParam(event, 'resourceId'),
    document: await readBody(event),
  });
});
