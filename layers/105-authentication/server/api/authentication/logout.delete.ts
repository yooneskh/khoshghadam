

export default defineEventHandler(async event => {

  const user = await assertUser(event);


  const authenticationTokens = await event.context.authenticationTokens.dbo.list({
    filter: {
      user: user._id,
    },
  });

  for (const authenticationToken of authenticationTokens) {
    await event.context.authenticationTokens.dbo.update({
      resourceId: authenticationToken._id,
      document: {
        isActive: false,
      },
    });
  }


  return true;

});
