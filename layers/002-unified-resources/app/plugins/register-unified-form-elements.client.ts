import FormElementResource from '../elements/form-element-resource.vue';
import FormElementTags from '../elements/form-element-tags.vue';
import FormElementMedia from '../elements/form-element-media.vue';


export default defineNuxtPlugin(() => {

  registerFormExtraElement({
    identifier: 'resource',
    component: FormElementResource,
  });

  registerFormExtraElement({
    identifier: 'tags',
    component: FormElementTags,
  });

  registerFormExtraElement({
    identifier: 'media',
    component: FormElementMedia,
  });

});
