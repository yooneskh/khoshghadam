

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.create',
  });
});
