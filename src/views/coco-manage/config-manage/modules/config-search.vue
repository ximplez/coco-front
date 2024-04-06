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

type RuleKey = Extract<keyof CocoApi.CocoConfig.CocoConfigSearchParams, 'nameSpace'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  const { formRules } = useCocoFormRules(); // inside computed to make locale reactive

  return {
    nameSpace: formRules.nameSpace
  };
});

const { bool: nsLoading, setTrue: nsLoadingStart, setFalse: nsLoadingEnd } = useBoolean(false);
const namespaces = shallowRef<string[]>([]);
const namespacesQuery = shallowRef<string>('');

async function refreshNamespaces() {
  const { error, data } = await fetchAllNamespace();

  if (!error) {
    namespaces.value = data || [];
  }
}

const namespaceSelectOptions = computed(() => {
  let namespaceSelect;
  if (!namespacesQuery.value) {
    namespaceSelect = namespaces.value.filter(item => ~item.indexOf(namespacesQuery.value));
  } else {
    namespaceSelect = namespaces.value;
  }
  const opts: CommonType.Option[] = namespaceSelect.map(page => ({
    label: page,
    value: page
  }));

  return opts;
});

async function handleSelectNameSpace(query: string) {
  nsLoadingStart();
  if (!query.length) {
    await refreshNamespaces();
  }
  namespacesQuery.value = query;
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
