

export default defineNuxtPlugin(async () => {

  if (useUser().value || !useToken().value) {
    return;
  }


  useUser().value = await ufetch('/authentication/identity');

});
