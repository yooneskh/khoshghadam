

export default defineEventHandler(async event => {

  await assertUserPermission({
    event,
    permission: 'admin.authentication.onboard-user',
  });


  const body = await assertBody({
    event,
    schema: {
      'name': 'string',
      'username': 'string',
      'password': 'string',
      'role?': 'string',
      'permissions?': 'string[]',
    },
  });


  const existingUser = await resources.users.dbo.find({
    filter: {
      username: body.username,
    },
  });

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'user already exists',
    });
  }


  if (body.role) {

    const role = await resources.authorizationRoles.dbo.find({
      resourceId: body.role,
    });

    if (!role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'role does not exist',
      });
    }

  }


  const passwordHash = await hashPassword(body.password);

  let user: any;
  let userPassword: any;


  try {

    user = await resources.users.dbo.create({
      document: {
        name: body.name,
        username: body.username,
      },
    });

    userPassword = await resources.userPasswords.dbo.create({
      document: {
        user: user._id,
        passwordHash,
        isActive: true,
      },
    });

    await resources.authorizationTokens.dbo.create({
      document: {
        user: user._id,
        ...(!body.permissions ? {} : {
          permissions: body.permissions,
        }),
        ...(!body.role ? {} : {
          roles: [body.role],
        }),
      },
    });


    return user;

  }
  catch (error) {

    if (user) {
      await resources.users.dbo.delete({
        resourceId: user._id,
      });
    }

    if (userPassword) {
      resources.userPasswords.dbo.delete({
        resourceId: userPassword._id,
      });
    }

    throw error;

  }

});
