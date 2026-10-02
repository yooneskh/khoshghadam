
/* responsibility */

// Creates a flash card session
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCardSessions',
    event,
    permission: 'admin.flash-card-sessions.create',
  });
});
