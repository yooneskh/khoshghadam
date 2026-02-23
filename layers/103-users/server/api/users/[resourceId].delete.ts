

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'users',
    event,
  });
});
