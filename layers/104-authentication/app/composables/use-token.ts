

export function useToken() {
  return useLocalStorage(
    `--${useAppConfig().brand.id}-authentication-token--`,
    '',
  );
}
