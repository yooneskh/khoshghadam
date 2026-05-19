

export default defineEventHandler(async event => {

  const body = await readBody(event);

  const user = await event.context.users.dbo.find({
    filter: {
      username: body.username,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid credentials',
    });
  }


  const userPassword = await event.context.userPasswords.dbo.find({
    filter: {
      user: user._id,
      isActive: true,
    },
  });

  if (!userPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid credentials',
    });
  }


  if (!await verifyPassword(body.password, userPassword.passwordHash)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'invalid credentials',
    });
  }


  return event.context.authenticationTokens.dbo.create({
    document: {
      user: user._id,
      token: generateUuid(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      isActive: true,
    },
  });

});
