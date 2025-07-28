<script setup>

/* interface */

const props = defineProps({
  pito: String,
  title: String,
});


/* window */

const isMaximized = ref(false);
const elHeader = useTemplateRef('elHeader')


const { width: windowWidth, height: windowHeight } = useWindowSize();


/* movement */

const width = ref(1024);
const height = ref(768);

const taskBarHeight = 40;


const { x, y } = useDraggable(elHeader, {
  initialValue: {
    x: windowWidth.value / 2 - width.value / 2,
    y: windowHeight.value / 2 - height.value / 2,
  },
});


const effectiveWidth = computed(() => {

  if (isMaximized.value) {
    return windowWidth.value;
  }

  return width.value;

});

const effectiveHeight = computed(() => {

  if (isMaximized.value) {
    return windowHeight.value - taskBarHeight;
  }

  return height.value;

});

const effectiveX = computed(() => {

  if (isMaximized.value) {
    return 0;
  }

  return radMax([
    0,
    radMin([
      x.value,
      windowWidth.value - width.value,
    ]),
  ]);

});

const effectiveY = computed(() => {

  if (isMaximized.value) {
    return 0;
  }

  return radMax([
    0,
    radMin([
      y.value,
      windowHeight.value - height.value - taskBarHeight,
    ]),
  ]);

});

</script>


<template>
  <div
    class="
      fixed
      top-0 left-0 w-screen h-[calc(100dvh-var(--window-task-bar-height))]
      lg:left-(--window-x) lg:top-(--window-y) lg:w-(--window-width) lg:h-(--window-height)
      z-1
      flex flex-col
      bg-white
      border-3 border-[#0019CF]
      overflow-clip
    "
    :class="{
      'rounded-t-lg': !isMaximized,
      '': isMaximized,
    }"
    :style="{
      '--window-x': `${effectiveX}px`,
      '--window-y': `${effectiveY}px`,
      '--window-width': `${effectiveWidth}px`,
      '--window-height': `${effectiveHeight}px`,
      '--window-task-bar-height': `${taskBarHeight}px`,
    }">

    <header
      ref="elHeader"
      class="
        h-10 shrink-0
        bg-[#0059F4]
        flex items-center gap-1
        text-white
        p-1 ps-2
        cursor-pointer
      "
      @dblclick="isMaximized = !isMaximized;">

      <img
        v-if="props.pito"
        :src="`/pitos/${props.pito}.png`"
        class="size-6"
      />

      <span class="text-white text-sm font-semibold">
        {{ props.title }}
      </span>

      <div class="grow" />

      <u-button
        variant="solid"
        :icon="!isMaximized ? 'i-lucide-maximize' : 'i-lucide-minimize'"
        color="info"
        size="sm"
        class="max-lg:hidden"
        @click="isMaximized = !isMaximized"
      />

      <u-button
        variant="solid"
        icon="i-lucide-x"
        color="error"
        size="sm"
        @click="useRouter().back();"
      />

    </header>

    <div class="h-0 grow overflow-y-auto">
      <slot />
    </div>


  </div>
</template>
