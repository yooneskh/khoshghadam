<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'fieldLabel' ])">
    <u-checkbox
      class="w-full"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'fieldLabel' ])"
      v-model="modelValue"
    />
  </u-form-field>
</template>
