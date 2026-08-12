<script setup>

/* interface */

const props = defineProps({
  column: Object,
  filter: Object,
});

const emit = defineEmits([
  'apply',
  'clear',
]);


/* filter */

const isOpen = ref(false);
let isSyncing = false;


const { resourcePath } = useResourceName({
  resource: () => props.column.resource,
});


const operatorItems = {
  'string': [
    {
      label: 'Contains',
      value: 'contains',
    },
    {
      label: 'Equals',
      value: 'eq',
    },
    {
      label: 'Does not equal',
      value: 'ne',
    },
  ],
  'number': [
    {
      label: 'Equals',
      value: 'eq',
    },
    {
      label: 'Does not equal',
      value: 'ne',
    },
    {
      label: 'Greater than',
      value: 'gt',
    },
    {
      label: 'Greater than or equal',
      value: 'gte',
    },
    {
      label: 'Less than',
      value: 'lt',
    },
    {
      label: 'Less than or equal',
      value: 'lte',
    },
  ],
  'date': [
    {
      label: 'On',
      value: 'on',
    },
    {
      label: 'Before',
      value: 'before',
    },
    {
      label: 'After',
      value: 'after',
    },
  ],
  'array': [
    {
      label: 'Contains',
      value: 'eq',
    },
    {
      label: 'Does not contain',
      value: 'ne',
    },
  ],
  'resource-array': [
    {
      label: 'Contains',
      value: 'eq',
    },
    {
      label: 'Does not contain',
      value: 'ne',
    },
  ],
  'collection': [
    {
      label: 'Is empty',
      value: 'empty',
    },
    {
      label: 'Is not empty',
      value: 'not-empty',
    },
  ],
  'object': [
    {
      label: 'Is empty',
      value: 'empty-object',
    },
    {
      label: 'Is not empty',
      value: 'not-empty-object',
    },
  ],
  'exact': [
    {
      label: 'Equals',
      value: 'eq',
    },
    {
      label: 'Does not equal',
      value: 'ne',
    },
  ],
};


const filterType = computed(() => {
  if (props.column.resource && props.column.type === 'array') {
    return 'resource-array';
  }
  else if (props.column.resource) {
    return 'resource';
  }
  else if (props.column.type === 'array' && props.column.items?.type === 'object') {
    return 'collection';
  }
  else if (props.column.type === 'array') {
    return 'array';
  }
  else if (props.column.type === 'object') {
    return 'object';
  }
  else if (props.column.enum) {
    return 'enum';
  }
  else if (props.column.type === 'boolean') {
    return 'boolean';
  }
  else if (props.column.type === 'date' || props.column.labelFormat) {
    return 'date';
  }
  else if (props.column.type === 'number') {
    return 'number';
  }
  else {
    return 'string';
  }
});

const operators = computed(() => {
  return operatorItems[filterType.value] || operatorItems.exact;
});

const fields = computed(() => {

  const valueField = getValueField();

  return [
    {
      key: 'operator',
      identifier: 'select',
      items: operators.value,
      placeholder: 'Condition',
    },
    ...(!valueField ? [] : [
      valueField,
    ]),
  ];

});


const { form, formTag } = useForm({
  fields,
});


watch(
  [
    () => props.filter,
    filterType,
  ],
  async ([filter]) => {

    isSyncing = true;

    form.value = {
      operator: filter?.operator ?? (['collection', 'object'].includes(filterType.value) ? undefined : operators.value[0]?.value),
      value: filter?.value,
    };

    await nextTick();

    isSyncing = false;

  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  form,
  async value => {

    if (isSyncing) {
      return;
    }


    const hasValue = (
      ['collection', 'object'].includes(filterType.value)
      || value.value === false
      || value.value === 0
      || !!value.value
    );

    if (!hasValue) {
      emit('clear');
      return;
    }


    const operator = operators.value.find(it => it.value === value.operator);
    const currentValue = value.value;
    let displayValue = currentValue;

    if (['resource', 'resource-array'].includes(filterType.value)) {

      const resource = await retrieveResource({
        resourcePath: resourcePath.value,
        id: currentValue,
        options: {
          silent: true,
        },
      });

      if (form.value.value !== currentValue) {
        return;
      }


      displayValue = resource.name || truncateMiddle(resource._id);

    }

    emit('apply', {
      operator: value.operator,
      operatorLabel: operator?.label,
      value: currentValue,
      inputValue: currentValue,
      displayValue,
    });

  },
  {
    deep: true,
  },
);


function getValueField() {
  if (['resource', 'resource-array'].includes(filterType.value)) {
    return {
      key: 'value',
      identifier: props.column.resource === 'media' ? 'media' : 'resource',
      resource: props.column.resource,
      multiple: false,
    };
  }
  else if (filterType.value === 'boolean') {
    return {
      key: 'value',
      identifier: 'select',
      items: [
        {
          label: 'True',
          value: true,
        },
        {
          label: 'False',
          value: false,
        },
      ],
      placeholder: 'Value',
    };
  }
  else if (filterType.value === 'enum') {
    return {
      key: 'value',
      identifier: 'select',
      items: props.column.enum,
      placeholder: 'Value',
    };
  }
  else if (filterType.value === 'date') {
    return {
      key: 'value',
      identifier: 'date',
    };
  }
  else if (filterType.value === 'number') {
    return {
      key: 'value',
      identifier: 'input',
      type: 'number',
      placeholder: 'Value',
    };
  }
  else if (['collection', 'object'].includes(filterType.value)) {
    return undefined;
  }
  else {
    return {
      key: 'value',
      identifier: 'input',
      placeholder: 'Value',
      autofocus: true,
    };
  }
}

</script>


<template>
  <u-popover
    :content="{
      align: 'start',
      side: 'bottom',
      sideOffset: 8,
    }"
    v-model:open="isOpen">

    <u-button
      variant="subtle"
      size="xs"
      icon="lucide:filter"
      :color="props.filter ? 'primary' : undefined"
    />

    <template #content>
      <div class="w-72 p-3">
        <form-tag />
      </div>
    </template>

  </u-popover>
</template>
