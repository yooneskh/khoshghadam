

export default defineEventHandler(async event => {
  return event.context.flashCards.update({
    resourceId: getRouterParam(event, 'resourceId'),
    document: await readBody(event),
  });
});
