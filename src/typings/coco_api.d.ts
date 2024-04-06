declare namespace CocoApi {
  namespace CocoConfig {
    type CommonSearchParams = Pick<Api.Common.PaginatingCommonParams, 'current' | 'size'>;

    /** user */
    type CocoConfig = Api.Common.CommonRecord<{
      id: string;
      namespace: string;
      category: string;
      key: string;
      value: string;
      keyType: string;
      desc: string;
      createTime: string;
      updateTime: string;
    }>;

    /** CocoConfig search params */
    type CocoConfigSearchParams = CommonType.RecordNullable<
      Pick<CocoConfig, 'namespace' | 'category' | 'key'> & CommonSearchParams
    >;

    /** CocoConfig list */
    type CocoConfigList = Api.Common.PaginatingQueryRecord<CocoConfig>;
  }
}
