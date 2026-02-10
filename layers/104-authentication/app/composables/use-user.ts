

export function useUser() {
  return useState(
    `--${useAppConfig().brand.id}-authentication-user--`,
    () => undefined as any,
  );
}
