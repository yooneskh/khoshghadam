
/* responsibility */

// Updates a flash card journey
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.update',
  });
});
