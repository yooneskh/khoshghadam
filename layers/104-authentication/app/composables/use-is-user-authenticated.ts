
/* responsibility */

// Reports whether a user
// is currently signed in.


export function useIsUserAuthenticated() {
  return computed(() => {
    return !!useUser().value;
  });
}
