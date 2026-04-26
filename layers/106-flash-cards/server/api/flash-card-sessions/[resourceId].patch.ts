

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCardSessions',
    event,
  });
});
