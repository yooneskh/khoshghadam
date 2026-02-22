

export default defineEventHandler(async event => {
  return event.context.flashCards.retrieve({
    resourceId: getRouterParam(event, 'resourceId'),
  });
});
