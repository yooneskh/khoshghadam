

export function useUFetch(request: Parameters<typeof useFetch>[0], options?: Parameters<typeof useFetch>[1]) {
  return useFetch(request, {
    ...(options || {}),
    $fetch: useNuxtApp().$api,
  });
}
