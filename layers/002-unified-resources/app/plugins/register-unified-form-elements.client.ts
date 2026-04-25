import FormElementResource from '../elements/form-element-resource.vue';
import FormElementTags from '../elements/form-element-tags.vue';


export default defineNuxtPlugin(() => {

  registerFormExtraElement({
    identifier: 'resource',
    component: FormElementResource,
  });

  registerFormExtraElement({
    identifier: 'tags',
    component: FormElementTags,
  });

});
