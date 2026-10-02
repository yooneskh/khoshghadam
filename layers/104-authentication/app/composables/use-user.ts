
/* responsibility */

// Holds the authenticated user
// in brand-scoped shared state.


export function useUser() {
  return useState(`--${useAppConfig().brand.id}-authentication-user--`, () => undefined as any);
}
