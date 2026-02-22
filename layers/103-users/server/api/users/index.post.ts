

export default defineEventHandler(async event => {
  return handleUnifiedCreateRoute({
    event,
    controller: event.context.users,
  });
});
