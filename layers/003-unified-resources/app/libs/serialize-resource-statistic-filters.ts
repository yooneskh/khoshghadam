
/* responsibility */

// Serializes statistic filters
// into the unified filter query string.


/* statistic filters */

export function serializeResourceStatisticFilters(filters?: Record<string, any>) {

  if (!filters) {
    return '';
  }


  return Object.entries(filters).map(([key, filter]) => {

    const { operator, value } = normalizeResourceStatisticFilter(filter);

    const serializedValue = Array.isArray(value) ? value.join(';') : (value ?? '');


    return `${key}:${operator}:${serializedValue}`;

  }).join(',');

}


function normalizeResourceStatisticFilter(filter: any) {
  if (filter && typeof filter === 'object' && !Array.isArray(filter)) {
    return {
      operator: filter.operator ?? 'is',
      value: filter.value,
    };
  }
  else {
    return {
      operator: 'is',
      value: filter,
    };
  }
}
