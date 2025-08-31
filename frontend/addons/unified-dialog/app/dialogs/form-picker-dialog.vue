<script setup>

/* interface */

const props = defineProps({
  icon: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  text: {
    type: String,
  },
  fields: {
    type: Array,
    required: true,
  },
  initialForm: {
    type: Object,
  },
  submitButton: {
    type: Object,
  },
  cancelButton: {
    type: Object,
  },
});

const emit = defineEmits([
  'close',
]);


/* form */

const { form, formTag } = useForm({
  target: !props.initialForm ? undefined : JSON.parse(JSON.stringify(props.initialForm)),
  fields: () => props.fields,
});


/* actions */

async function handleSubmit() {

  if (props.submitButton?.onClick) {
    await props.submitButton?.onClick(form.value);
  }

  emit('close', form.value);

}

</script>


<template>
  <u-modal @update:open="!$event && emit('close')">
    <template #content>
      <u-card>
        
        <un-typography
          :icon="props.icon"
          :title="props.title"
          :subtitle="props.subtitle"
          :text="props.text"
        />

        <form-tag
          class="mt-4"          
        />

        <div class="flex items-end gap-2 mt-4">

          <u-button
            label="Submit"
            v-bind="radOmit(props.submitButton, [ 'onClick' ])"
            loading-auto
            @click="handleSubmit()"
          />

          <div class="grow" />

          <u-button
            variant="soft"
            label="Cancel"
            v-bind="radOmit(props.cancelButton, [ 'onClick' ])"
            loading-auto
            @click="emit('close')"
          />

        </div>

      </u-card>
    </template>
  </u-modal>
</template>
