

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCardSessions',
    event,
  });
});
