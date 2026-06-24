

export function useIsUserAuthenticated() {
  return computed(() => {
    return !!useUser().value;
  });
}
