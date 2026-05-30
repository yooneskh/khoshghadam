

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCardSessions',
    event,
    // permission: 'admin.flash-card-sessions.schema',
  });
});
