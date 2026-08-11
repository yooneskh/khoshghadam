

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCardJourneys',
    event,
    permission: 'admin.flash-card-journeys.update',
  });
});
