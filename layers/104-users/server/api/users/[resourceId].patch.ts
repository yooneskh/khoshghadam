

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'users',
    event,
  });
});
