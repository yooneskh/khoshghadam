

declare module 'ofetch' {
  interface FetchOptions {
    enabled?: MaybeRefOrGetter<boolean>;
    silent?: boolean;
    handled?: boolean;
  }
}


function onRequest(args: any) {

  args.options.baseURL = '/api';


  if ('enabled' in args.options && !toValue(args.options.enabled)) {
    args.options.handled = true;
    throw new Error('request is aborted');
  }


  if (useToken().value) {
    args.options.headers.set('authorization', useToken().value);
  }

}


export const ufetch = $fetch.create({
  onRequest,
  onRequestError: generalHandler,
  onResponse: generalHandler,
  onResponseError: generalHandler,
});

export const useUFetch = createUseFetch(callerOptions => ({
  onRequest,
  onRequestError: generalHandler,
  onResponse: generalHandler,
  onResponseError: generalHandler,
  ...callerOptions,
}));


function generalHandler(args: any) {

  if (args.options.handled || args.options.silent || [200, 201, 202, 204].includes(args.response?.status)) {
    return;
  }


  args.options.handled = true;


  if (args.response?.status === 401) {

    toastError({
      title: 'You need to login or register.',
    });

    navigateTo({
      name: 'authentication.login',
    });

    return;

  }


  toastError({
    title: args.response?._data?.message ?? 'There was a problem. Please try again.',
  });

}
