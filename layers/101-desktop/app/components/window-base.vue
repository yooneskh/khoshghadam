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
const minWidth = ref(400);
const minHeight = ref(300);

const taskBarHeight = 40;


const { x, y } = useDraggable(elHeader, {
  initialValue: {
    x: 200,
    y: 100,
  },
});


/* resize */

const isResizing = ref(false);
const resizeDirection = ref('');

const resizeStartData = ref({
  mouseX: 0,
  mouseY: 0,
  windowWidth: 0,
  windowHeight: 0,
  windowX: 0,
  windowY: 0,
});


function startResize(direction, event) {

  if (isMaximized.value) {
    return;
  }


  isResizing.value = true;
  resizeDirection.value = direction;

  resizeStartData.value = {
    mouseX: event.clientX,
    mouseY: event.clientY,
    windowWidth: width.value,
    windowHeight: height.value,
    windowX: x.value,
    windowY: y.value,
  };

  event.preventDefault();
  event.stopPropagation();


  const cursorClass = getCursorClass(direction);

  document.addEventListener('mousemove', handleResizeMove, { passive: false });
  document.addEventListener('mouseup', stopResize, { once: true });
  document.body.classList.add('select-none', cursorClass);

}

function handleResizeMove(event) {

  if (!isResizing.value) {
    return;
  }


  const deltaX = event.clientX - resizeStartData.value.mouseX;
  const deltaY = event.clientY - resizeStartData.value.mouseY;
  const direction = resizeDirection.value;

  let newWidth = resizeStartData.value.windowWidth;
  let newHeight = resizeStartData.value.windowHeight;
  let newX = resizeStartData.value.windowX;
  let newY = resizeStartData.value.windowY;


  if (direction.includes('e')) {
    newWidth = Math.max(minWidth.value, resizeStartData.value.windowWidth + deltaX);
  }

  if (direction.includes('w')) {
    const proposedWidth = resizeStartData.value.windowWidth - deltaX;
    if (proposedWidth >= minWidth.value) {
      newWidth = proposedWidth;
      newX = resizeStartData.value.windowX + deltaX;
    }
    else {
      newWidth = minWidth.value;
      newX = resizeStartData.value.windowX + resizeStartData.value.windowWidth - minWidth.value;
    }
  }

  if (direction.includes('s')) {
    newHeight = Math.max(minHeight.value, resizeStartData.value.windowHeight + deltaY);
  }

  if (direction.includes('n')) {
    const proposedHeight = resizeStartData.value.windowHeight - deltaY;
    if (proposedHeight >= minHeight.value) {
      newHeight = proposedHeight;
      newY = resizeStartData.value.windowY + deltaY;
    }
    else {
      newHeight = minHeight.value;
      newY = resizeStartData.value.windowY + resizeStartData.value.windowHeight - minHeight.value;
    }
  }


  if (newX < 0) {
    newWidth = Math.max(minWidth.value, newWidth + newX);
    newX = 0;
  }

  if (newY < 0) {
    newHeight = Math.max(minHeight.value, newHeight + newY);
    newY = 0;
  }

  if (newX + newWidth > windowWidth.value) {
    newWidth = Math.max(minWidth.value, windowWidth.value - newX);
  }

  if (newY + newHeight > windowHeight.value - taskBarHeight) {
    newHeight = Math.max(minHeight.value, windowHeight.value - newY - taskBarHeight);
  }


  width.value = newWidth;
  height.value = newHeight;
  x.value = newX;
  y.value = newY;

}

function stopResize() {

  if (!isResizing.value) {
    return;
  }


  document.removeEventListener('mousemove', handleResizeMove);
  document.removeEventListener('mouseup', stopResize);

  document.body.classList.remove('select-none', getCursorClass(resizeDirection.value));


  isResizing.value = false;
  resizeDirection.value = '';

}

function getCursorClass(direction) {
  return {
    'n': 'cursor-n-resize',
    's': 'cursor-s-resize',
    'e': 'cursor-e-resize',
    'w': 'cursor-w-resize',
    'ne': 'cursor-ne-resize',
    'nw': 'cursor-nw-resize',
    'se': 'cursor-se-resize',
    'sw': 'cursor-sw-resize',
  }[direction] || 'cursor-default';
}


onBeforeUnmount(() => {
  stopResize();
});


/* dimensions */

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

  return Math.max(...[
    0,
    Math.min(...[
      x.value,
      windowWidth.value - width.value,
    ]),
  ]);

});

const effectiveY = computed(() => {

  if (isMaximized.value) {
    return 0;
  }

  return Math.max(...[
    0,
    Math.min(...[
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
      bg-default
      border-3 border-[#0019CF]
    "
    :class="{
      'rounded-t-lg': !isMaximized,
    }"
    :style="{
      '--window-x': `${effectiveX}px`,
      '--window-y': `${effectiveY}px`,
      '--window-width': `${effectiveWidth}px`,
      '--window-height': `${effectiveHeight}px`,
      '--window-task-bar-height': `${taskBarHeight}px`,
    }">

    <template v-if="!isMaximized">
      <div
        class="absolute -top-2 left-5 right-5 h-4 cursor-n-resize z-1100"
        @mousedown="startResize('n', $event)"
      />
      <div
        class="absolute -bottom-2 left-5 right-5 h-4 cursor-s-resize z-1100"
        @mousedown="startResize('s', $event)"
      />
      <div
        class="absolute top-5 bottom-5 -left-2 w-4 cursor-w-resize z-1100"
        @mousedown="startResize('w', $event)"
      />
      <div
        class="absolute top-5 bottom-5 -right-2 w-4 cursor-e-resize z-1100"
        @mousedown="startResize('e', $event)"
      />
      <div
        class="absolute -top-2 -left-2 w-6 h-6 cursor-nw-resize z-1100"
        @mousedown="startResize('nw', $event)"
      />
      <div
        class="absolute -top-2 -right-2 w-6 h-6 cursor-ne-resize z-1100"
        @mousedown="startResize('ne', $event)"
      />
      <div
        class="absolute -bottom-2 -left-2 w-6 h-6 cursor-sw-resize z-1100"
        @mousedown="startResize('sw', $event)"
      />
      <div
        class="absolute -bottom-2 -right-2 w-6 h-6 cursor-se-resize z-1100"
        @mousedown="startResize('se', $event)"
      />
    </template>

    <header
      ref="elHeader"
      class="
        h-10 shrink-0
        bg-[#0059F4]
        flex items-center gap-1
        text-inverted
        p-1 ps-2
        cursor-pointer
      "
      @dblclick="isMaximized = !isMaximized;">

      <img
        v-if="props.pito"
        :src="`/pitos/${props.pito}.png`"
        class="size-6"
      />

      <span class="text-sm text-inverted font-semibold">
        {{ props.title }}
      </span>

      <div class="grow" />

      <u-button
        variant="solid"
        :icon="!isMaximized ? 'lucide:maximize' : 'lucide:minimize'"
        color="info"
        size="sm"
        class="max-lg:hidden"
        @click="isMaximized = !isMaximized"
      />

      <u-button
        variant="solid"
        icon="lucide:x"
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
