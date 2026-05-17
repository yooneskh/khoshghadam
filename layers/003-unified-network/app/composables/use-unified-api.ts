

declare module 'ofetch' {
  interface FetchOptions {
    enabled?: MaybeRefOrGetter<boolean>;
  }
}


export const ufetch = $fetch.create({

  onRequest: args => {

    args.options.baseURL = '/api';

    if ('enabled' in args.options && !toValue(args.options.enabled)) {
      (args as any).request = undefined;
    }

  },

  onRequestError: async ({ options, request, response }) => {
    await generalHandler(options, request, response)
  },
  onResponse: async ({ options, request, response }) => {
    await generalHandler(options, request, response)
  },
  onResponseError: async ({ options, request, response }) => {
    await generalHandler(options, request, response)
  },

});

export const useUFetch = createUseFetch(callerOptions => ({
  $fetch: ufetch as typeof $fetch,
  ...callerOptions,
}));


async function generalHandler(options: any, request: any, response: any) {

  if (typeof request === 'string' && request.includes('/schema')) {
    return;
  }

  if (options.handled || [200, 201, 202, 204].includes(response?.status) || options.silent) {
    return;
  }


  toastError({
    title: response?._data?.message ?? 'There was a problem. Please try again.',
  });


  options.handled = true;

}
