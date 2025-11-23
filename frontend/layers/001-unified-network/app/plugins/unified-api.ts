

async function generalHandler(options: any, request: any, response: any) {

  if (options.loading) {
    options.loading.value = false;
  }


  if (!options.handled && response && response?.status !== 200 && response?.status !== 201 && !options.silent) {

    toastError({
      title: response?._data?.message ?? 'There was a problem. Please try again.',
    });

    options.handled = true;

  }

}


export default defineNuxtPlugin(() => {

  const $api = $fetch.create({
    baseURL: `${useRuntimeConfig().public.baseApiUrl}/api/v0`,
    onRequest: async ({ options }) => {

      if ((options as any).loading) {
        (options as any).loading.value = true;
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


  return {
    provide: {
      api: $api,
    },
  };

});
