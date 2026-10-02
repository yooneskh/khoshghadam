
/* responsibility */

// Loads the signed-in user's identity
// on app start when only a token is present.


export default defineNuxtPlugin(async () => {

  if (useUser().value || !useToken().value) {
    return;
  }


  try {
    useUser().value = await ufetch('/api/authentication/identity', {
      silent: true,
    });
  }
  catch {
    // noop
  }

});
