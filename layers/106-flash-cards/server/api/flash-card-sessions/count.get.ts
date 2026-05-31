

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCardSessions',
    event,
    permission: 'admin.flash-card-sessions.count',
  });
});
