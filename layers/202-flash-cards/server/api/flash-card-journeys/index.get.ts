
/* responsibility */

// Lists flash card journeys
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.list',
  });
});
