import { UnForm } from '#components';


interface IOptions {
  target?: MaybeRefOrGetter<any>;
  fields: MaybeRefOrGetter<any[]>;
}

export function useForm(options: IOptions) {

  const formData: Ref<any> = toRef(options.target || {});
  const formFields = computed(() => toValue(options.fields) || []);

  const FormTag = defineComponent({
    setup() {
      return () => {
        return h(UnForm, {
          target: toValue(formData),
          fields: toValue(formFields),
        });
      };
    },
  });

  return {
    form: formData,
    formTag: FormTag,
  };

}
