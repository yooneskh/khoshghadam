
/* responsibility */

// Logs the current user out
// by deactivating all of their authentication tokens.


export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  const authenticationTokens = await app.authenticationTokens.dbo.list({
    filter: {
      user: user._id,
    },
  });


  await radMap(authenticationTokens, authenticationToken => {
    return app.authenticationTokens.dbo.update({
      resourceId: authenticationToken._id,
      document: {
        isActive: false,
      },
    });
  });


  return true;

});
