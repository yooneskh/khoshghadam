

export default defineNuxtRouteMiddleware(to => {
  if (!useIsUserAuthenticated().value) {
    return navigateTo({
      name: 'authentication.login',
      query: {
        returnUrl: to.fullPath,
      },
    });
  }
});
