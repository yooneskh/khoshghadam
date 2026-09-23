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

import { useResourceName } from '../libs/use-resource-name';
import { retrieveResource } from '../libs/retrieve-resource';
import { truncateMiddle } from '../libs/truncate-middle';


const isOpen = ref(false);
let isSyncing = false;


const { resourcePath } = useResourceName({
  resource: () => props.column.resource,
});


const operatorItems = {
  'string': [
    {
      value: 'contains',
      label: 'Contains',
    },
    {
      value: 'eq',
      label: 'Equals',
    },
    {
      value: 'ne',
      label: 'Does not equal',
    },
  ],
  'number': [
    {
      value: 'eq',
      label: 'Equals',
    },
    {
      value: 'ne',
      label: 'Does not equal',
    },
    {
      value: 'gt',
      label: 'Greater than',
    },
    {
      value: 'gte',
      label: 'Greater than or equal',
    },
    {
      value: 'lt',
      label: 'Less than',
    },
    {
      value: 'lte',
      label: 'Less than or equal',
    },
  ],
  'date': [
    {
      value: 'on',
      label: 'On',
    },
    {
      value: 'before',
      label: 'Before',
    },
    {
      value: 'after',
      label: 'After',
    },
  ],
  'array': [
    {
      value: 'eq',
      label: 'Contains',
    },
    {
      value: 'ne',
      label: 'Does not contain',
    },
  ],
  'resource-array': [
    {
      value: 'eq',
      label: 'Contains',
    },
    {
      value: 'ne',
      label: 'Does not contain',
    },
  ],
  'collection': [
    {
      value: 'empty',
      label: 'Is empty',
    },
    {
      value: 'not-empty',
      label: 'Is not empty',
    },
  ],
  'object': [
    {
      value: 'empty-object',
      label: 'Is empty',
    },
    {
      value: 'not-empty-object',
      label: 'Is not empty',
    },
  ],
  'exact': [
    {
      value: 'eq',
      label: 'Equals',
    },
    {
      value: 'ne',
      label: 'Does not equal',
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


watchImmediate(
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
  },
);

watch(
  form,
  async value => {

    if (isSyncing) {
      return;
    }


    const hasValue = ['collection', 'object'].includes(filterType.value) || value.value === false || value.value === 0 || !!value.value;

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
          value: true,
          label: 'True',
        },
        {
          value: false,
          label: 'False',
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

    <template v-if="filter">
      <u-button
        color="primary"
        size="xs"
        icon="lucide:filter"
      />
    </template>

    <template v-else>
      <u-button
        variant="subtle"
        size="xs"
        icon="lucide:filter"
      />
    </template>

    <template #content>
      <div class="w-72 p-3">
        <form-tag />
      </div>
    </template>

  </u-popover>
</template>
