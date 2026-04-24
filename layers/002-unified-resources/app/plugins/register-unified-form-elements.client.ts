

export default defineNuxtPlugin(() => {

  registerFormExtraElement({
    identifier: 'resource',
    component: defineAsyncComponent(() => import('../elements/form-element-resource.vue')),
  });

});
