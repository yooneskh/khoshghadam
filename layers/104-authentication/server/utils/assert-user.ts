

export async function assertUser(args: { event: H3Event, fillPermissions?: boolean }) {

  const authorizationHeader = args.event.headers.get('authorization');
  const apiKeyHeader = args.event.headers.get('x-api-key');

  let userId: string;
  let apiKeyPermissions: string[] | undefined;
  let apiKeyRoles: string[] | undefined;


  if (authorizationHeader) {

    const authenticationToken = await resources.authenticationTokens.dbo.find({
      filter: {
        token: authorizationHeader,
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


    userId = authenticationToken.user;

  }
  else if (apiKeyHeader) {

    const userApiKey = await resources.userApiKeys.dbo.find({
      filter: {
        apiKey: apiKeyHeader,
        isActive: true,
      },
    });

    if (!userApiKey) {
      throw createUnauthenticatedError();
    }


    if (userApiKey.expiresAt <= Date.now()) {

      await resources.userApiKeys.dbo.update({
        resourceId: userApiKey._id,
        document: {
          isActive: false,
        },
      });

      throw createUnauthenticatedError();

    }


    userId = userApiKey.owner;
    apiKeyPermissions = userApiKey.permissions;
    apiKeyRoles = userApiKey.roles;

  }
  else {
    throw createUnauthenticatedError();
  }


  const user = await resources.users.dbo.find({
    resourceId: userId,
  });

  if (!user) {
    throw createUnauthenticatedError();
  }


  const filledUser = user as typeof user & { permissions?: string[] };


  if (args.fillPermissions) {

    filledUser.permissions = [];


    let permissions: string[] = [];
    let roles: string[] = [];


    if (apiKeyHeader) {
      permissions = apiKeyPermissions ?? [];
      roles = apiKeyRoles ?? [];
    }
    else {

      const authorizationToken = await resources.authorizationTokens.dbo.find({
        filter: {
          'user': filledUser._id,
        },
      });

      if (authorizationToken) {
        permissions = authorizationToken.permissions ?? [];
        roles = authorizationToken.roles ?? [];
      }

    }


    if (!roles.length) {
      filledUser.permissions = permissions;
    }
    else {

      const authorizationRoles = await resources.authorizationRoles.dbo.list({
        filter: {
          '_id': {
            $in: roles,
          },
        },
      });

      filledUser.permissions = [
        ...new Set([
          ...permissions,
          ...authorizationRoles.map(it => it.permissions).flat(),
        ]),
      ];

    }

  }


  return filledUser;

}
