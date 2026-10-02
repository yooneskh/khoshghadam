
/* responsibility */

// Exposes the authentication token
// stored in a brand-scoped cookie.


export function useToken() {
  return useCookie(`--${useAppConfig().brand.id}-authentication-token--`, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}
