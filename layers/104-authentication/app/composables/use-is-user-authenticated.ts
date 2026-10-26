
/* responsibility */

// Reports whether a user
// is currently signed in.


export function useIsUserAuthenticated() {

  const user = useUser();

  return computed(() => {
    return !!user.value;
  });

}
