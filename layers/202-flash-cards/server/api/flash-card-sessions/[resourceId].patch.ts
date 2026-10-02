
/* responsibility */

// Updates a flash card session
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCardSessions',
    event,
    permission: 'admin.flash-card-sessions.update',
  });
});
