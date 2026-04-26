

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCardSessions',
    event,
  });
});
