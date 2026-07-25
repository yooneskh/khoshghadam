

declare module 'ofetch' {
  interface FetchOptions {
    silent?: boolean;
    handled?: boolean;
  }
}


function onRequest(args: any) {

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

export const useUFetch = createUseFetch({
  onRequest,
  onRequestError: generalHandler,
  onResponse: generalHandler,
  onResponseError: generalHandler,
});


function generalHandler(args: any) {

  if (args.options.handled || args.options.silent || String(args.response?.status)?.[0] === '2') {
    return;
  }


  args.options.handled = true;


  if (args.response?.status === 401) {

    toastError({
      title: 'You need to login or register.',
    });

    return void navigateTo({
      name: 'authentication.login',
    });

  }


  toastError({
    title: args.response?._data?.message ?? 'There was a problem. Please try again.',
  });

}
