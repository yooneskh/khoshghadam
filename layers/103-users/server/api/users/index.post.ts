

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'users',
    event,
  });
});
