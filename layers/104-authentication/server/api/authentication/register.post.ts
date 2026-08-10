

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
      'name': 'string',
      'username': 'string',
      'password': 'string',
    },
  });


  const oldUser = await app.users.dbo.find({
    filter: {
      username: body.username,
    },
  });

  if (oldUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'user already exists',
    });
  }


  const newUser = await app.users.dbo.create({
    document: {
      name: body.name,
      username: body.username,
    },
  });

  await app.userPasswords.dbo.create({
    document: {
      user: newUser._id,
      passwordHash: await hashPassword(body.password),
      isActive: true,
    },
  });


  return app.authenticationTokens.dbo.create({
    document: {
      user: newUser._id,
      token: generateUuid(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      isActive: true,
    },
  });

});
