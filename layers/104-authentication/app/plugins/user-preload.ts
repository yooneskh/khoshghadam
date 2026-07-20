

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
