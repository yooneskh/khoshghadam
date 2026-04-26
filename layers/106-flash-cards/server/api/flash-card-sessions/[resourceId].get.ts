

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCardSessions',
    event,
  });
});
