<script setup>

/* interface */

const props = defineProps({
  column: Object,
  row: Object,
  data: {},
});

const emit = defineEmits([
  'resource:update',
]);


/* resource */

const tickle = ref(0);


const { fields } = useResourceMeta({
  resource: () => radDash(wordToPlural(props.column.ref || '')),
});


const resourceData = asyncComputed(async () => {

  tickle.value;

  if (!props.column.ref || !props.data) {
    return;
  }


  return ufetch(`/${radDash(wordToPlural(props.column.ref))}/${props.data}`);

});


const resourceTitle = asyncComputed(async () => {

  tickle.value;

  if (!props.column.ref || !props.data || !props.data?.length) {
    return '';
  }


  const resources = await Promise.all(
    radCastArray(props.data).map(async it =>
      ufetch(`/${radDash(wordToPlural(props.column.ref))}/${it}`),
    ),
  );


  return resources.map(it => it.name).join(' - ');

});


async function handleResourceClick() {
  await launchFormPickerDialog({
    title: `Update ${radTitle(props.column.ref)}`,
    subtitle: resourceData.value._id,
    text: `Update the information and click submit to save.`,
    fields: fields.value,
    initialForm: radOmit(resourceData.value, ['_id', 'createdAt', 'updatedAt']),
    submitButton: {
      icon: 'lucide:pencil',
      label: `Update`,
      onClick: async form => {

        await ufetch(`/${radDash(wordToPlural(props.column.ref))}/${resourceData.value._id}`, {
          method: 'patch',
          body: form,
        });


        tickle.value++;

        toastSuccess({
          title: `${radTitle(props.column.ref)} updated successfully.`,
        });

      },
    },
  });
}

async function handleViewItems() {
  launchTableDialog({
    icon: 'lucide:list',
    title: 'View Items',
    subtitle: 'View items of this field',
    columns: props.column.items.properties.map(it => ({
      accessorKey: it.key,
      header: radTitle(it.key),
    })),
    data: props.data,
  });
}

</script>


<template>

  <template v-if="props.column.ref">
    <a class="text-primary underline cursor-pointer" @click="handleResourceClick()">
      {{ resourceTitle }}
    </a>
  </template>

  <template v-else-if="props.column.type === 'array' && props.column.items.type === 'string'">
    <div class="w-xs flex flex-wrap gap-1">
      <template v-for="item of props.data || []">
        <u-badge
          variant="subtle"
          :label="item"
        />
      </template>
    </div>
  </template>

  <template v-else-if="props.column.type === 'array' && props.column.items.type === 'object'">
    <a class="text-primary underline cursor-pointer" @click="handleViewItems()">
      View Items
    </a>
  </template>

  <template v-else-if="props.column.type === 'date' || props.column.labelFormat">
    {{ formatDate(props.data, props.column.labelFormat) }}
  </template>

  <template v-else>
    {{ props.data }}
  </template>

</template>
