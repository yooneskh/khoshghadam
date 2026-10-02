<script setup>

/* responsibility */

// Shows one media file
// at full size inside a modal.


/* interface */

const props = defineProps({
  media: Object,
});

const emit = defineEmits([
  'close',
]);

</script>


<template>
  <u-modal :ui="{ content: props.media?.type?.startsWith('image') ? '' : 'max-w-5xl' }" scrollable @update:open="!$event && emit('close')">
    <template #content>

      <template v-if="props.media?.type?.startsWith('image')">
        <img :src="props.media.path" />
      </template>

      <template v-else>
        <object
          class="w-full! h-128"
          :data="props.media?.path"
          :type="props.media?.type"
        />
      </template>

    </template>
  </u-modal>
</template>
