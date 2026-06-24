

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'flashCardSessions',
    event,
    permission: 'admin.flash-card-sessions.delete',
  });
});
