

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'users',
    event,
    permission: 'admin.users.schema',
  });
});
