

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCardSessions',
    event,
  });
});
