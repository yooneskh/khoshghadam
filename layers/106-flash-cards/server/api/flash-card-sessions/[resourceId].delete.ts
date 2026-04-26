

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'flashCardSessions',
    event,
  });
});
