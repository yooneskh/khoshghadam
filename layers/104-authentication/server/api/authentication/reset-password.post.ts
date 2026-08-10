

export default defineEventHandler(async event => {

  await assertUserPermission({
    event,
    permission: 'admin.authentication.reset-password',
  });


  const body = await assertBody({
    event,
    schema: {
      'user': 'string',
      'password': 'string',
    },
  });


  const user = await app.users.dbo.find({
    resourceId: body.user,
  });

  if (!user) {
    throw createError({
      status: 404,
      statusText: 'User not found.',
    });
  }


  const passwordHash = await hashPassword(body.password);

  const [userPasswords, authenticationTokens] = await Promise.all([
    app.userPasswords.dbo.list({
      filter: {
        user: user._id,
        isActive: true,
      },
    }),
    app.authenticationTokens.dbo.list({
      filter: {
        user: user._id,
        isActive: true,
      },
    }),
  ]);


  await Promise.all([
    ...userPasswords.map(userPassword => {
      return app.userPasswords.dbo.update({
        resourceId: userPassword._id,
        document: {
          isActive: false,
        },
      });
    }),
    ...authenticationTokens.map(authenticationToken => {
      return app.authenticationTokens.dbo.update({
        resourceId: authenticationToken._id,
        document: {
          isActive: false,
        },
      });
    }),
  ]);


  await app.userPasswords.dbo.create({
    document: {
      user: user._id,
      passwordHash,
      isActive: true,
    },
  });


  return true;

});
