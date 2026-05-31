

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCardSessions',
    event,
    permission: 'admin.flash-card-sessions.create',
  });
});
