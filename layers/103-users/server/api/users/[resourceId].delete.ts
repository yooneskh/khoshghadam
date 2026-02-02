

export default defineEventHandler(async event => {
  return event.context.users.delete({
    resourceId: getRouterParam(event, 'resourceId'),
  });
});
