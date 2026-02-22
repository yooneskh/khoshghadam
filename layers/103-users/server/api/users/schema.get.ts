

export default defineEventHandler(async event => {
  return handleUnifiedSchemaRoute({
    event,
    controller: event.context.users,
  });
});
