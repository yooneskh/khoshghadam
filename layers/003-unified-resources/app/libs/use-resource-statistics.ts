
/* responsibility */

// Counts resource documents
// for a list of statistic configs.


/* types */

export interface ResourceStatisticFilter {
  operator: string;
  value?: any;
}

export interface ResourceStatisticConfig {
  resource: string;
  title?: string;
  icon?: string;
  color?: string;
  description?: string;
  filters?: Record<string, ResourceStatisticFilter | string | number | boolean>;
  format?: 'number' | 'percent' | ((value: number) => string);
  to?: any;
  showTotal?: boolean;
}

export interface ResourceStatisticResult {
  config: ResourceStatisticConfig;
  value?: number;
  total?: number;
  pending: boolean;
  error: boolean;
}


/* statistics */

import { serializeResourceStatisticFilters } from './serialize-resource-statistic-filters';
import { resolveResourcePath } from './use-resource-name';


export function useResourceStatistics(args: { statistics: MaybeRefOrGetter<ResourceStatisticConfig[]>, onLoaded?: (results: ResourceStatisticResult[]) => void, onError?: (results: ResourceStatisticResult[]) => void }) {

  const results = ref<ResourceStatisticResult[]>([]);
  const isStatisticsPending = ref(false);


  const statistics = computed(() => {
    return toValue(args.statistics) || [];
  });

  const signature = computed(() => {
    return JSON.stringify(statistics.value.map(it => {
      return {
        resource: it.resource,
        filters: it.filters || {},
        showTotal: !!it.showTotal,
      };
    }));
  });


  watchImmediate(signature, refreshStatistics);


  async function refreshStatistics() {

    const currentStatistics = statistics.value;

    if (!currentStatistics.length) {
      results.value = [];
      isStatisticsPending.value = false;
      return;
    }


    isStatisticsPending.value = true;

    results.value = currentStatistics.map(it => {
      return {
        config: it,
        pending: true,
        error: false,
      };
    });


    const fetchedResults = await Promise.all(currentStatistics.map(it => {
      return fetchStatistic(it);
    }));


    results.value = fetchedResults;

    isStatisticsPending.value = false;


    if (fetchedResults.some(it => it.error)) {
      args.onError?.(fetchedResults);
    }
    else {
      args.onLoaded?.(fetchedResults);
    }

  }

  async function fetchStatistic(statistic: ResourceStatisticConfig) {

    const result: ResourceStatisticResult = {
      config: statistic,
      pending: true,
      error: false,
    };


    try {
      const resourcePath = resolveResourcePath(statistic.resource);
      const filter = serializeResourceStatisticFilters(statistic.filters);

      const countResponse = await ufetch(`/api/${resourcePath}/count`, {
        silent: true,
        query: {
          'filter': filter,
        },
      });

      result.value = Number(countResponse);


      if (statistic.showTotal) {
        const totalResponse = await ufetch(`/api/${resourcePath}/count`, {
          silent: true,
        });

        result.total = Number(totalResponse);
      }
    }
    catch {
      result.error = true;
    }

    result.pending = false;

    return result;

  }


  return {
    results,
    isStatisticsPending,
    refresh: refreshStatistics,
  };

}
