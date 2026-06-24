<script setup>

/* interface */

const props = defineProps({
  columns: Array,
  loading: Boolean,
  data: Array,
  hidePagination: Boolean,
  totalItems: Number,
  actions: Array,
  extraActions: Array,
  stickyActions: Boolean,
  ui: Object,
  meta: Object,
});


const currentPage = defineModel('currentPage', {
  type: [Number, String],
  default: '1',
});

const itemsPerPage = defineModel('itemsPerPage', {
  type: [Number, String],
  default: '25',
});


/* columns */

const fullColumns = computed(() => {
  return [
    ...props.columns,
    ...(!props.actions?.length ? [] : [
      {
        header: 'Actions',
        accessorKey: 'actions',
        meta: {
          class: {
            th: 'text-end!',
          },
        },
      },
    ]),
  ];
});

</script>


<template>
  <div>

    <u-table
      v-bind="$attrs"
      :columns="fullColumns"
      loading-color="neutral"
      :loading="props.loading"
      :data="props.data"
      :column-pinning="{
        right: props.stickyActions ? ['actions'] : undefined,
      }"
      :ui="{
        tr: 'data-[expanded=true]:bg-elevated!',
        ...(props.ui || {}),
      }"
      :meta="props.meta"
      @hover="">

      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template v-if="!!props.actions?.length" #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-1">

          <template v-for="(action, index) in props.actions" :key="index">
            <template v-if="!action.vIf || action.vIf(row.original)">

              <template v-if="!action.actionType || action.actionType === 'button'">
                <u-tooltip :text="action.tooltip">
                  <u-button
                    variant="subtle"
                    v-bind="radOmit(action, ['tooltip', 'to', 'href', 'disabled', 'onClick'])"
                    :to="typeof action.to === 'function' ? action.to(row.original) : action.to"
                    :href="typeof action.href === 'function' ? action.href(row.original) : action.href"
                    :disabled="typeof action.disabled === 'function' ? action.disabled(row.original) : action.disabled"
                    loading-auto
                    @click="action.onClick?.(row.original)"
                  />
                </u-tooltip>
              </template>

              <template v-else-if="action.actionType === 'separator'">
                <u-separator
                  orientation="vertical"
                  class="h-6 mx-1"
                />
              </template>

            </template>
          </template>

          <template v-if="!!props.extraActions?.length">

            <template v-if="!!props.actions?.length">
              <u-separator
                orientation="vertical"
                class="h-6 mx-1"
              />
            </template>

            <u-dropdown-menu
              :items="props.extraActions.map(it => ({
                ...it,
                href: typeof it.href === 'function' ? it.href(row.original) : it.href,
                onClick: () => it.onClick?.(row.original),
              }))">
              <u-button
                variant="subtle"
                icon="lucide:ellipsis-vertical"
              />
            </u-dropdown-menu>

          </template>

        </div>
      </template>

    </u-table>

    <div v-if="!props.hidePagination" class="flex items-center gap-2 p-3 border-t border-default">
      <u-pagination
        active-color="neutral"
        :total="props.totalItems"
        :items-per-page="Number(itemsPerPage)"
        :page="Number(currentPage)"
        @update:page="currentPage = $event;"
      />
      <div class="grow" />
      <u-select
        :items="[5, 10, 25, 50, 100]"
        v-model="itemsPerPage"
      />
      <span class="text-sm">
        Items per page
      </span>
    </div>

  </div>
</template>
