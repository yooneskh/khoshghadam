

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'authorizationRoles',
    event,
    permission: 'admin.authorization-roles.update',
  });
});
