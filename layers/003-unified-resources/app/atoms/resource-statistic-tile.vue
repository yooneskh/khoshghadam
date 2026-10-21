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
  return props.statistic?.error || props.statistic?.value == null ? '—' : props.statistic.value.toLocaleString();
});


/* icon */

const iconColorClasses = {
  primary: 'bg-primary-500/10 text-primary-500',
  success: 'bg-success-500/10 text-success-500',
  warning: 'bg-warning-500/10 text-warning-500',
  error: 'bg-error-500/10 text-error-500',
  info: 'bg-info-500/10 text-info-500',
  neutral: 'bg-neutral-500/10 text-neutral-500',
};


/* navigation */

function handleNavigate(event) {
  if (!props.statistic.config.to) {
    event.preventDefault();
  }
}

</script>


<template>
  <nuxt-link class="block" :to="props.statistic.config.to" :aria-disabled="!props.statistic.config.to" :tabindex="props.statistic.config.to ? undefined : -1" @click="handleNavigate($event)">

    <template v-if="props.layout === 'chips'">
      <u-badge
        variant="subtle"
        :color="props.statistic?.config?.color"
        size="lg"
        :icon="props.statistic.config.icon"
        :label="`${valueText} ${props.statistic.config.title}`"
      />
    </template>

    <template v-else>
      <u-card :ui="{ body: 'p-3' }">
        <div class="flex items-center gap-3">

          <template v-if="props.statistic.config.icon">
            <div class="size-12 shrink-0 flex items-center justify-center rounded-lg" :class="iconColorClasses[props.statistic.config.color]">
              <u-icon
                :name="props.statistic.config.icon"
                class="size-6"
              />
            </div>
          </template>

          <div class="grow">

            <div class="text-2xl font-semibold tabular-nums" :class="{ 'text-muted': props.statistic.error || props.statistic.value == null }">
              {{ valueText }}
            </div>

            <div class="text-sm text-muted truncate">
              {{ props.statistic.config.title }}
            </div>

          </div>

        </div>
      </u-card>
    </template>

  </nuxt-link>
</template>
