

async function generalHandler(options: any, request: any, response: any) {

  if (options.handled || [200, 201, 202, 204].includes(response?.status) || options.silent) {
    return;
  }


  toastError({
    title: response?._data?.message ?? 'There was a problem. Please try again.',
  });


  options.handled = true;

}


export default defineNuxtPlugin(() => {

  const $api = $fetch.create({
    baseURL: '/api',
    onRequest: async ({ options }) => {

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


  return {
    provide: {
      api: $api,
    },
  };

});
