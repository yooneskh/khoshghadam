
/* responsibility */

// Deletes a flash card journey
// for admins.


export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.delete',
  });
});
