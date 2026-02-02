

export default defineEventHandler(async event => {
  return event.context.users.retrieve({
    resourceId: getRouterParam(event, 'resourceId'),
  });
});
