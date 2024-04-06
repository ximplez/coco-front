<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { $t } from '@/locales';
import { useCocoFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchAllNamespace } from '@/service/api/coco-config';
import { useBoolean } from '~/packages/hooks';

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

type RuleKey = Extract<keyof CocoApi.CocoConfig.CocoConfigSearchParams, 'nameSpace' | 'key'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useCocoFormRules(); // inside computed to make locale reactive

  return {
    nameSpace: patternRules.nameSpace,
    key: patternRules.key
  };
});

const { bool: nsLoading, setTrue: nsLoadingStart, setFalse: nsLoadingEnd } = useBoolean(false);
const namespaces = shallowRef<string[]>([]);

async function getNamespaces() {
  const { error, data } = await fetchAllNamespace();

  if (!error) {
    namespaces.value = data || [];
  }
}

const namespaceSelectOptions = computed(() => {
  const opts: CommonType.Option[] = namespaces.value.map(page => ({
    label: page,
    value: page
  }));

  return opts;
});

async function handleSelectNameSpace(query: string) {
  nsLoadingStart();
  if (!query.length) {
    await getNamespaces();
    nsLoadingEnd();
    return;
  }
  namespaces.value = namespaces.value.filter(item => ~item.indexOf(query));
  nsLoadingEnd();
}

async function updateShow(show: boolean) {
  if (show) {
    await handleSelectNameSpace('');
  }
}

// async function reset() {
//   await restoreValidation();
//   emit('reset');
// }

async function search() {
  window.$message?.success($t('common.updateSuccess'));
  console.log(formRef.value);
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
            remote
            filterable
            :on-update-show="updateShow"
            :on-update-value="handleSelectNameSpace"
            @search="handleSelectNameSpace"
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:10" label="配置键" path="key">
          <NInput v-model:value="model.key" placeholder="配置键" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="配置目录" path="userPhone" class="pr-24px">
          <NInput v-model:value="model.category" placeholder="配置目录" />
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
