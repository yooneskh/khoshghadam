

export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  const authenticationTokens = await app.authenticationTokens.dbo.list({
    filter: {
      user: user._id,
    },
  });


  for (const authenticationToken of authenticationTokens) {
    await app.authenticationTokens.dbo.update({
      resourceId: authenticationToken._id,
      document: {
        isActive: false,
      },
    });
  }


  return true;

});
