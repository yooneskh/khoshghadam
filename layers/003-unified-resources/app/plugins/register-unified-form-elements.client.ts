
/* responsibility */

// Registers the resource, tags, and media
// custom form elements.


import FormElementResource from '../atoms/form-element-resource.vue';
import FormElementTags from '../atoms/form-element-tags.vue';
import FormElementMedia from '../atoms/form-element-media.vue';


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
