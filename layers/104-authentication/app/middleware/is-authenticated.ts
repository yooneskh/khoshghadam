

export default defineNuxtRouteMiddleware(() => {
  if (!useIsUserAuthenticated().value) {
    return navigateTo({
      name: 'authentication.login',
    });
  }
});
