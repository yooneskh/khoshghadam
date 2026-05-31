

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCardSessions',
    event,
    permission: 'admin.flash-card-sessions.list',
  });
});
