

export default defineEventHandler(async event => {

  await assertRateLimit({
    event,
    limit: 5,
  });

  await assertCaptchaCode({
    event,
  });


  const body = await assertBody({
    event,
    schema: {
      'username': 'string',
      'password': 'string',
    },
  });


  const user = await app.users.dbo.find({
    filter: {
      username: body.username,
    },
  });

  if (!user) {
    throw createUnauthenticatedError();
  }


  const userPassword = await app.userPasswords.dbo.find({
    filter: {
      user: user._id,
      isActive: true,
    },
  });

  if (!userPassword) {
    throw createUnauthenticatedError();
  }


  if (!await verifyPassword(body.password, userPassword.passwordHash)) {
    throw createUnauthenticatedError();
  }


  return app.authenticationTokens.dbo.create({
    document: {
      user: user._id,
      token: generateUuid(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      isActive: true,
    },
  });

});
