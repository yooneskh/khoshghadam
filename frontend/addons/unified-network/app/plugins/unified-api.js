

function generalHandler(options, request, response) {

  if (options.loading) {
    options.loading.value = false;
  }

  if (!options.handled && response && response?.status !== 200 && !options.silent) {

    toastError({
      title: response?._data?.error ?? 'مشکلی پیش آمده است. لطفا دوباره تلاش کنید.',
    });

    options.handled = true;

  }

}


export default defineNuxtPlugin(() => {

  const $api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl,
    onRequest: ({ options }) => {

      if (options.loading) {
        options.loading.value = true;
      }

    },
    onRequestError: ({ options, request, response }) => {
      generalHandler(options, request, response)
    },
    onResponse: ({ options, request, response }) => {
      generalHandler(options, request, response)
    },
    onResponseError: ({ options, request, response }) => {
      generalHandler(options, request, response)
    },
  });


  return {
    provide: {
      api: $api,
    },
  };

});
