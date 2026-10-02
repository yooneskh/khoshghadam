
/* responsibility */

// Counts flash card journeys
// for admins.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.count',
  });
});
