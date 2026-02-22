

export default defineEventHandler(async event => {
  return handleUnifiedDeleteRoute({
    event,
    controller: event.context.users,
  });
});
