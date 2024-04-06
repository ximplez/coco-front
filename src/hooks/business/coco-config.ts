import { type Ref, computed, ref } from 'vue';
import { trim } from 'zrender/lib/core/util';
import type { ApiFn, Transformer } from '~/packages/hooks';
import { useBoolean } from '~/packages/hooks';

export function useSelect<T, A extends ApiFn>(config: {
  apiFn: A;
  /** api params */
  apiParams?: Parameters<A>[0];
  /** transform api response to table data */
  transformer: Transformer<T, Awaited<ReturnType<A>>>;
  extractString: (t: T) => string;
}) {
  const { bool: loading, setTrue: loadingStart, setFalse: loadingEnd } = useBoolean(false);
  const data: Ref<T[]> = ref([]);
  const dataQuery: Ref<string> = ref('');

  const { apiFn, transformer, apiParams, extractString } = config;

  async function refresh() {
    const response = await apiFn(apiParams);

    const transformed = transformer(response as Awaited<ReturnType<A>>);

    data.value = transformed.data;
  }

  const selectOptions = computed(() => {
    let select;
    if (!dataQuery.value) {
      select = data.value.filter(item => ~extractString(item).indexOf(dataQuery.value));
    } else {
      select = data.value;
    }
    const opts: CommonType.Option[] = select.map(t => ({
      label: extractString(t),
      value: extractString(t)
    }));

    return opts;
  });

  async function handleSelectQuery(query: string) {
    loadingStart();
    const q = trim(query);
    if (!q.length) {
      await refresh();
    }
    dataQuery.value = q;
    loadingEnd();
  }

  return {
    loading,
    selectOptions,
    handleSelectQuery
  };
}
