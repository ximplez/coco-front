<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import { useCocoFormRules, useNaiveForm } from '@/hooks/common/form';
import { useSelect } from '@/hooks/business/coco-config';
import { fetchAllCategory, fetchAllNamespace } from '@/service/api/coco-config';

defineOptions({
  name: 'ConfigSearch'
});

interface Emits {
  (e: 'reset'): void;

  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate } = useNaiveForm();

const model = defineModel<CocoApi.CocoConfig.CocoConfigSearchParams>('model', {
  required: true
});

type RuleKey = Extract<keyof CocoApi.CocoConfig.CocoConfigSearchParams, 'nameSpace'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  const { formRules } = useCocoFormRules(); // inside computed to make locale reactive

  return {
    nameSpace: formRules.nameSpace
  };
});

const {
  handleSelectQuery: handleSelectNameSpace,
  loading: nsLoading,
  selectOptions: namespaceSelectOptions
} = useSelect<string>({
  apiFn: fetchAllNamespace,
  apiParams: null,
  transformer: res => {
    const records = res.data || [];
    return {
      data: records,
      pageNum: 0,
      pageSize: 0,
      total: 0
    };
  },
  extractString: t => t
});

async function updateNameSpaceShow(show: boolean) {
  if (show) {
    await handleSelectNameSpace('');
  }
}

const {
  handleSelectQuery: handleSelectCategory,
  loading: ctLoading,
  selectOptions: categorySelectOptions
} = useSelect<string>({
  apiFn: fetchAllCategory,
  apiParams: { namespace: 'namespace' },
  transformer: res => {
    const records = res.data || [];
    return {
      data: records,
      pageNum: 0,
      pageSize: 0,
      total: 0
    };
  },
  extractString: t => t
});

async function updateCategoryShow(show: boolean) {
  if (show) {
    await handleSelectCategory('');
  }
}

// async function reset() {
//   await restoreValidation();
//   emit('reset');
// }

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24 s:12 m:6" label="命名空间" path="nameSpace">
          <NSelect
            v-model:value="model.nameSpace"
            :options="namespaceSelectOptions"
            :loading="nsLoading"
            filterable
            :on-update-show="updateNameSpaceShow"
            :on-update-value="search"
            :on-search="handleSelectNameSpace"
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:10" label="配置键" path="key">
          <NInput
            v-model:value="model.key"
            placeholder="配置键"
            clearable
            :disabled="!model.nameSpace"
            :allow-input="(value: string) => !value.startsWith(' ') && !value.endsWith(' ')"
            :on-keydown="
              (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                  search();
                }
              }
            "
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="配置目录" path="category">
          <NSelect
            v-model:value="model.category"
            :options="categorySelectOptions"
            :loading="ctLoading"
            filterable
            :disabled="!model.nameSpace"
            :on-update-show="updateCategoryShow"
            :on-update-value="search"
            :on-search="handleSelectCategory"
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:12 m:2">
          <NSpace class="w-full" justify="end">
            <!--            <NButton @click="reset">-->
            <!--              <template #icon>-->
            <!--                <icon-ic-round-refresh class="text-icon" />-->
            <!--              </template>-->
            <!--              {{ $t('common.reset') }}-->
            <!--            </NButton>-->
            <NButton type="primary" ghost @click="search">
              <!--              <template #icon>-->
              <!--                <icon-ic-round-search class="text-icon" />-->
              <!--              </template>-->
              {{ $t('common.search') }}
            </NButton>
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
