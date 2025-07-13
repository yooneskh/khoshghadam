<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'label' ])">
    <u-input
      class="w-full"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'label' ])"
      v-model="modelValue"
    />
  </u-form-field>
</template>
