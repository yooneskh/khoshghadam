
/* responsibility */

// Redirects unauthenticated visitors to login,
// keeping the requested page as the return URL.


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
