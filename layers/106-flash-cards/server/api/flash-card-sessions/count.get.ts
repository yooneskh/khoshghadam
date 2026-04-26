

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCardSessions',
    event,
  });
});
