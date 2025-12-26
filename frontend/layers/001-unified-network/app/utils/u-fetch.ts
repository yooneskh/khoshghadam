

export function ufetch(url: string, options?: Parameters<typeof $fetch>[1] & { silent?: boolean }) {
  return useNuxtApp().$api(url, options);
}
