import { requestCoco } from '@/service/request';

export function fetchAllNamespace() {
  return requestCoco<string[]>({
    url: `/meta/getAllNamespace`,
    method: 'get'
  });
}

export function fetchAllCategory(params: { namespace: string }) {
  return requestCoco<string[]>({
    url: `/meta/getAllCategoryByNamespace`,
    method: 'get',
    params
  });
}

export function fetchCocoConfig(params?: CocoApi.CocoConfig.CocoConfigSearchParams) {
  return requestCoco<CocoApi.CocoConfig.CocoConfigList>({
    url: `/config/getConfigPage`,
    method: 'get',
    params
  });
}

export function newCocoConfig(params: CocoApi.CocoConfig.CocoConfig) {
  return requestCoco<boolean>({
    url: `/config/newConfig`,
    method: 'post',
    data: params
  });
}

export function updateCocoConfig(params: CocoApi.CocoConfig.CocoConfig) {
  return requestCoco<boolean>({
    url: `/config/updateConfig`,
    method: 'post',
    data: params
  });
}

export function deleteCocoConfig(params?: { ids?: (string | number)[]; categories?: string[] }) {
  return requestCoco<boolean>({
    url: `/config/deleteConfig`,
    method: 'post',
    data: params
  });
}
