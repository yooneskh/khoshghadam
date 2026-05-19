import type { H3Event } from 'h3';


export async function assertUser(event: H3Event) {

  const authenticationToken = await event.context.authenticationTokens.dbo.find({
    filter: {
      token: event.headers.get('authorization'),
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


  const user = await event.context.users.dbo.find({
    resourceId: authenticationToken.user,
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'unauthorized',
    });
  }


  return user;

}
