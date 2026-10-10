
/* responsibility */

// Seeds the users listed in runtime config
// with their passwords and permissions.


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


      if (initialUser.permissions !== undefined && !Array.isArray(initialUser.permissions)) {
        throw createError({
          statusCode: 500,
          statusMessage: 'invalid initial user permissions',
        });
      }


      let user = await app.users.dbo.find({
        filter: {
          username: initialUser.username,
        },
      });

      if (!user) {
        user = await app.users.dbo.create({
          document: {
            name: initialUser.name,
            username: initialUser.username,
          },
        });
      }


      const userPassword = await app.userPasswords.dbo.find({
        filter: {
          user: user._id,
        },
      });

      if (!userPassword) {
        await app.userPasswords.dbo.create({
          document: {
            user: user._id,
            passwordHash: await hashPassword(initialUser.password),
            isActive: true,
          },
        });
      }


      if (initialUser.permissions !== undefined) {

        const authorizationToken = await app.authorizationTokens.dbo.find({
          filter: {
            user: user._id,
          },
        });

        if (!authorizationToken) {
          await app.authorizationTokens.dbo.create({
            document: {
              user: user._id,
              permissions: initialUser.permissions,
            },
          });
        }

      }

    }

  });
});
