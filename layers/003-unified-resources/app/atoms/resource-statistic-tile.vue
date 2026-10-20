<script setup>

/* responsibility */

// Renders one resource statistic
// with its value and label.


/* interface */

const props = defineProps({
  statistic: Object,
  layout: String,
});


/* value */

const valueText = computed(() => {
  if (!props.statistic || props.statistic.error || props.statistic.value === undefined || props.statistic.value === null) {
    return '—';
  }
  else if (typeof props.statistic.config.format === 'function') {
    return props.statistic.config.format(props.statistic.value);
  }
  else if (props.statistic.config.format === 'percent' && !props.statistic.total) {
    return '—';
  }
  else if (props.statistic.config.format === 'percent') {
    return `${formatNumber((props.statistic.value / props.statistic.total) * 100)}%`;
  }
  else {
    return formatNumber(props.statistic.value);
  }
});

const totalText = computed(() => {
  if (!props.statistic?.total) {
    return '';
  }
  else {
    return `of ${formatNumber(props.statistic.total)}`;
  }
});

const valueClasses = computed(() => {
  return [
    'text-2xl font-semibold tabular-nums',
    {
      'text-muted': props.statistic?.error || props.statistic?.value === undefined,
    },
  ];
});


/* icon */

const iconClasses = computed(() => {

  const color = props.statistic?.config?.color;

  return [
    'size-9 shrink-0 flex items-center justify-center rounded-lg',
    {
      'bg-primary-500/10 text-primary-500': !color || color === 'primary',
      'bg-success-500/10 text-success-500': color === 'success',
      'bg-warning-500/10 text-warning-500': color === 'warning',
      'bg-error-500/10 text-error-500': color === 'error',
      'bg-info-500/10 text-info-500': color === 'info',
      'bg-neutral-500/10 text-neutral-500': color === 'neutral',
    },
  ];

});


/* link */

const tag = computed(() => {
  return props.statistic?.config?.to ? resolveComponent('NuxtLink') : 'div';
});

const tagProps = computed(() => {
  if (!props.statistic?.config?.to) {
    return {};
  }
  else {
    return {
      to: props.statistic.config.to,
    };
  }
});


/* format */

function formatNumber(value) {
  return value.toLocaleString();
}

</script>


<template>
  <component :is="tag" v-bind="tagProps" class="block">

    <template v-if="props.layout === 'chips'">
      <div class="inline-flex items-center gap-1.5 rounded-lg border border-default px-2.5 py-1.5">

        <template v-if="props.statistic.config.icon">
          <u-icon
            size="4"
            :name="props.statistic.config.icon"
          />
        </template>

        <span class="text-sm font-semibold tabular-nums">
          {{ valueText }}
        </span>

        <span class="text-sm text-muted">
          {{ props.statistic.config.title }}
        </span>

      </div>
    </template>

    <template v-else>
      <u-card :ui="{ body: 'p-3' }">
        <div class="flex items-center gap-3">

          <template v-if="props.statistic.config.icon">
            <div :class="iconClasses">
              <u-icon :name="props.statistic.config.icon" />
            </div>
          </template>

          <div class="grow">

            <div :class="valueClasses">
              {{ valueText }}
            </div>

            <div class="text-sm text-muted truncate">
              {{ props.statistic.config.title }}
            </div>

            <template v-if="totalText">
              <div class="text-xs text-dimmed">
                {{ totalText }}
              </div>
            </template>

          </div>

        </div>
      </u-card>
    </template>

  </component>
</template>
