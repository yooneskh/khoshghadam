

declare module 'ofetch' {
  interface FetchOptions {
    silent?: boolean;
    handled?: boolean;
  }
}


function onRequest(args: any) {
  if (useToken().value && !args.options.headers.has('authorization')) {
    args.options.headers.set('authorization', useToken().value);
  }
}

function handleFetch(args: any) {

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


export const ufetch = $fetch.create({
  onRequest,
  onRequestError: handleFetch,
  onResponse: handleFetch,
  onResponseError: handleFetch,
});

export const useUFetch = createUseFetch({
  onRequest,
  onRequestError: handleFetch,
  onResponse: handleFetch,
  onResponseError: handleFetch,
});
