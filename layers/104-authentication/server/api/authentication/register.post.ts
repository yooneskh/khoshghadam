

export default defineEventHandler(async event => {

  const body = await readBody(event);


  const oldUser = await event.context.users.find({
    filter: {
      username: body.username,
    },
  });

  if (oldUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User already exists',
    });
  }


  const newUser = await event.context.users.create({
    document: {
      username: body.username,
      password: await hashPassword(body.password),
    },
  });

  const authenticationToken = await event.context.authenticationTokens.create({
    document: {
      user: newUser._id,
      token: generateUuid(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      isActive: true,
    },
  });


  return authenticationToken;

});
