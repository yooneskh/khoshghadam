
/* responsibility */

// Returns the flash card journeys
// schema for admins.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.schema',
  });
});
