

export default defineEventHandler(async event => {
  return handleUnifiedRetrieveRoute({
    event,
    controller: event.context.users,
  });
});
