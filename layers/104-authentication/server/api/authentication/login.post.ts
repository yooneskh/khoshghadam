

export default defineEventHandler(async event => {

  const body = await assertBody({
    event,
    schema: {
      'username': 'string',
      'password': 'string',
    },
  });


  const user = await resources.users.dbo.find({
    filter: {
      username: body.username,
    },
  });

  if (!user) {
    throw createUnauthenticatedError();
  }


  const userPassword = await resources.userPasswords.dbo.find({
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


  return resources.authenticationTokens.dbo.create({
    document: {
      user: user._id,
      token: generateUuid(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      isActive: true,
    },
  });

});
