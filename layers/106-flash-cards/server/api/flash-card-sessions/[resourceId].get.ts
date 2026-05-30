

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCardSessions',
    event,
    // permission: 'admin.flash-card-sessions.retrieve',
  });
});
