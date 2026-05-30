import type { H3Event } from 'h3';


export async function assertUser(args: { event: H3Event, fillPermissions?: boolean }) {

  const authenticationToken = await args.event.context.authenticationTokens.dbo.find({
    filter: {
      token: args.event.headers.get('authorization'),
      expiresAt: { $gt: Date.now() },
      isActive: true,
    },
  });

  if (!authenticationToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'unauthorized',
    });
  }


  const user = await args.event.context.users.dbo.find({
    resourceId: authenticationToken.user,
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'unauthorized',
    });
  }


  const filledUser = user as typeof user & { permissions?: string[] };


  if (args.fillPermissions) {

    filledUser.permissions = [];


    const authorizationToken = await args.event.context.authorizationTokens.dbo.find({
      filter: {
        'user': filledUser._id,
      },
    });

    if (authorizationToken) {
      if (!authorizationToken.roles?.length) {
        filledUser.permissions = authorizationToken.permissions;
      }
      else {

        const authorizationRoles = await args.event.context.authorizationRoles.dbo.list({
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
