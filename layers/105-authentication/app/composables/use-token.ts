

export function useToken() {
  return useCookie(
    `--${useAppConfig().brand.id}-authentication-token--`,
  );
}
