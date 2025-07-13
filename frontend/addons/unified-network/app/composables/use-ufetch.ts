

export function useUFetch(url: Parameters<typeof useFetch>[0], options?: Parameters<typeof useFetch>[1]) {
  return useFetch(url, {
    ...(options || {}),
    $fetch: useNuxtApp().$api,
  });
}
