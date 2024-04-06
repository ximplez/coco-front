declare namespace CocoApi {
  namespace CocoConfig {
    type CommonSearchParams = Pick<Api.Common.PaginatingCommonParams, 'current' | 'size'>;

    /** user */
    type CocoConfig = Api.Common.CommonRecord<{
      id: string;
      nameSpace: string;
      category: string;
      key: string;
      value: string;
      keyType: string;
      desc: string;
      createTime: number | 0;
      updateTime: number | 0;
    }>;

    /** CocoConfig search params */
    type CocoConfigSearchParams = CommonType.RecordNullable<
      Pick<CocoConfig, 'nameSpace' | 'category' | 'key'> & CommonSearchParams
    >;

    /** CocoConfig list */
    type CocoConfigList = Api.Common.PaginatingQueryRecord<CocoConfig>;
  }
}
