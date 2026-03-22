

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'users',
    event,
  });
});
