<script setup>

/* interface */

const props = defineProps({
  items: Array,
});


/* table */

const selectedName = ref();


function isRowSelected(item) {
  return selectedName.value === item.name;
}

function handleRowSelect(item) {
  selectedName.value = item.name;
}

</script>


<template>
  <table class="w-full text-sm">

    <thead>
      <tr>
        <th class="text-start font-medium px-2 py-1 border-b border-default bg-elevated">
          Name
        </th>
      </tr>
    </thead>

    <tbody>
      <template v-for="item in props.items" :key="item.name">
        <tr
          class="cursor-pointer select-none"
          :class="isRowSelected(item) ? 'bg-primary text-inverted' : 'hover:bg-primary/50'"
          @click="handleRowSelect(item)">

          <td class="p-0">
            <template v-if="item.to">
              <nuxt-link
                class="flex items-center gap-2 w-full px-2 py-1 min-w-0"
                :to="item.to">

                <img
                  :src="`/pitos/${item.pito}.png`"
                  class="size-4 shrink-0"
                />

                <span class="truncate">
                  {{ item.name }}
                </span>

              </nuxt-link>
            </template>
            <template v-else>
              <div class="flex items-center gap-2 w-full px-2 py-1 min-w-0">
                <img
                  :src="`/pitos/${item.pito}.png`"
                  class="size-4 shrink-0"
                />

                <span class="truncate">
                  {{ item.name }}
                </span>
              </div>
            </template>
          </td>

        </tr>
      </template>
    </tbody>

  </table>
</template>
