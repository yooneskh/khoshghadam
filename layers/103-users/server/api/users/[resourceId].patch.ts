

export default defineEventHandler(async event => {
  return handleUnifiedUpdateRoute({
    event,
    controller: event.context.users,
  });
});
