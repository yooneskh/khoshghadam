

export function ufetch(url: Parameters<typeof $fetch>[0], options?: Parameters<typeof $fetch>[1]) {
  return useNuxtApp().$api(url, options);
}
