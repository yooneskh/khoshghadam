

export default defineEventHandler(async event => {

  const body = await readBody(event);

  const user = await event.context.users.find({
    filter: {
      username: body.username,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }


  if (!await verifyPassword(body.password, user.password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }


  const authenticationToken = await event.context.authenticationTokens.create({
    document: {
      user: user._id,
      token: generateUuid(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      isActive: true,
    },
  });


  return authenticationToken;

});
