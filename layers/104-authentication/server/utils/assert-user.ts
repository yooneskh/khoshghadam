

export async function assertUser(args: { event: H3Event, fillPermissions?: boolean }) {

  const authenticationToken = await resources.authenticationTokens.dbo.find({
    filter: {
      token: args.event.headers.get('authorization'),
      isActive: true,
    },
  });

  if (!authenticationToken) {
    throw createUnauthenticatedError();
  }


  if (authenticationToken.expiresAt <= Date.now()) {

    await resources.authenticationTokens.dbo.update({
      resourceId: authenticationToken._id,
      document: {
        isActive: false,
      },
    });

    throw createUnauthenticatedError();

  }


  const user = await resources.users.dbo.find({
    resourceId: authenticationToken.user,
  });

  if (!user) {
    throw createUnauthenticatedError();
  }


  const filledUser = user as typeof user & { permissions?: string[] };


  if (args.fillPermissions) {

    filledUser.permissions = [];


    const authorizationToken = await resources.authorizationTokens.dbo.find({
      filter: {
        'user': filledUser._id,
      },
    });

    if (authorizationToken) {
      if (!authorizationToken.roles?.length) {
        filledUser.permissions = authorizationToken.permissions;
      }
      else {

        const authorizationRoles = await resources.authorizationRoles.dbo.list({
          filter: {
            '_id': {
              $in: authorizationToken.roles,
            },
          },
        });

        filledUser.permissions = [
          ...new Set([
            ...authorizationToken.permissions,
            ...authorizationRoles.map(it => it.permissions).flat(),
          ]),
        ];

      }
    }

  }


  return filledUser;

}
