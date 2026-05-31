

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'authorizationRoles',
    event,
    permission: 'admin.authorization-roles.list',
  });
});
