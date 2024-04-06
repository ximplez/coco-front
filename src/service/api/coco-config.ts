import { requestCoco } from '@/service/request';

export function fetchAllNamespace() {
  return requestCoco<string[]>({
    url: `/meta/getAllNamespace`,
    method: 'get'
  });
}

export function fetchCocoConfig(params?: CocoApi.CocoConfig.CocoConfigSearchParams) {
  return requestCoco<CocoApi.CocoConfig.CocoConfigList>({
    url: `/config/getConfigPage`,
    method: 'get',
    params
  });
}
