
/* responsibility */

// Checks that the requesting user holds a resource permission,
// including wildcard permits that end in **.


export async function assertUserPermission(args: { event: H3Event, permission: string }) {

  const user = await assertUser({
    event: args.event,
    fillPermissions: true,
  });


  if (!user.permissions?.length) {
    throw createUnauthorizedError();
  }


  if (!user.permissions.some(it => matchUserPermit(it, args.permission))) {
    throw createUnauthorizedError();
  }


  return user;

}

function matchUserPermit(permit: string, permission: string) {
  if (!permit.includes('**')) {
    return permit === permission;
  }
  else {
    return permit.slice(0, permit.indexOf('**')) === permission.slice(0, permit.indexOf('**'));
  }
}
