

export default defineEventHandler(async event => {
  return handleUnifiedListRoute({
    event,
    controller: event.context.users,
  });
});
