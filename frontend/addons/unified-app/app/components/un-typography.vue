<script setup>

/* interface */

const props = defineProps({
  icon: {
    type: String,
  },
  iconClasses: {
    type: String,
  },
  title: {
    type: String,
  },
  titleClasses: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  subtitleClasses: {
    type: String,
  },
  text: {
    type: String,
  },
  textClasses: {
    type: String,
  },
});

const slots = useSlots();


/* flags */

const shouldShow = computed(() => {
  return props.icon || props.title || props.subtitle || props.text || slots.append;
});

</script>


<template>
  <div v-if="shouldShow">

    <div v-if="props.title || props.subtitle || props.icon || slots.append" class="flex gap-2">
      <u-icon
        v-if="props.icon"
        :name="props.icon"
        class="size-7 m-1"
        :class="props.iconClasses"
      />
      <div v-if="props.title || props.subtitle">
        <h1 v-if="props.title" class="text-[1.5em] font-medium" :class="props.titleClasses">
          {{ props.title }}
        </h1>
        <h2 v-if="props.subtitle" class="text-[0.9em] font-light" :class="props.subtitleClasses">
          {{ props.subtitle }}
        </h2>
      </div>
      <template v-if="$slots.append">
        <div v-if="$slots.append" class="mt-1 ms-auto">
          <slot name="append" />
        </div>
      </template>
    </div>

    <p
      v-if="props.text"
      class="text-[1em]"
      :class="[
        {
          'mt-2': props.title || props.subtitle,
        },
        props.textClasses
      ]">
      {{ props.text }}
    </p>

  </div>  
</template>
