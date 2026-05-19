

export default defineNuxtRouteMiddleware(() => {
  if (!useToken().value) {
    return navigateTo({
      name: 'authentication.login',
    });
  }
});
