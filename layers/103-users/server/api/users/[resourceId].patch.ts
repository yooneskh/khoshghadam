

export default defineEventHandler(async event => {
  return event.context.users.update({
    resourceId: getRouterParam(event, 'resourceId'),
    document: await readBody(event),
  });
});
