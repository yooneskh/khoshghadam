

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.retrieve',
  });
});
