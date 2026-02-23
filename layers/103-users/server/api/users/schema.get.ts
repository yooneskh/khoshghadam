

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'users',
    event,
  });
});
