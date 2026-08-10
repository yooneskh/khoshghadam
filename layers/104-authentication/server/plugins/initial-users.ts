

export default defineNitroPlugin(() => {
  Promise.resolve().then(async () => {

    const initialUsers = useRuntimeConfig().initialUsers as any;

    if (!Array.isArray(initialUsers) || !initialUsers?.length) {
      return;
    }


    for (const initialUser of initialUsers) {

      if (!initialUser.username || !initialUser.name || !initialUser.password) {
        throw createError({
          statusCode: 500,
          statusMessage: 'invalid initial user',
        });
      }


      const existingUser = await app.users.dbo.find({
        filter: {
          username: initialUser.username,
        },
      });

      if (existingUser) {
        continue;
      }


      const user = await app.users.dbo.create({
        document: {
          name: initialUser.name,
          username: initialUser.username,
        },
      });

      await app.userPasswords.dbo.create({
        document: {
          user: user._id,
          passwordHash: await hashPassword(initialUser.password),
          isActive: true,
        },
      });


      if (initialUser.permissions !== undefined) {

        if (!Array.isArray(initialUser.permissions)) {
          throw createError({
            statusCode: 500,
            statusMessage: 'invalid initial user permissions',
          });
        }

        await app.authorizationTokens.dbo.create({
          document: {
            user: user._id,
            permissions: initialUser.permissions,
          },
        });

      }

    }

  });
});
