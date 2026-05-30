

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'users',
    event,
    // permission: 'admin.users.list',
  });
});
