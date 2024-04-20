<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useCocoFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { useSelect } from '@/hooks/business/coco-config';
import { fetchAllCategory, newCocoConfig, updateCocoConfig } from '@/service/api/coco-config';

defineOptions({
  name: 'ConfigOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: CocoApi.CocoConfig.CocoConfig | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增配置',
    edit: '编辑配置'
  };
  return titles[props.operateType];
});

const keyEditable = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, boolean> = {
    add: true,
    edit: false
  };
  return titles[props.operateType];
});

type Model = Pick<CocoApi.CocoConfig.CocoConfig, 'namespace' | 'category' | 'key' | 'value' | 'keyType' | 'desc'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    namespace: props.rowData?.namespace || '',
    category: '',
    key: '',
    value: '',
    keyType: '',
    desc: ''
  };
}

type RuleKey = Extract<keyof Model, 'namespace' | 'key' | 'value'>;

const rules = computed<Record<RuleKey, App.Global.FormRule[]>>(() => {
  const { formRules } = useCocoFormRules(); // inside computed to make locale reactive

  return {
    namespace: formRules.namespace,
    key: formRules.key,
    value: formRules.value
  };
});

const categoryApiParams = reactive({ namespace: props.rowData?.namespace });

function handleUpdateModelWhenEdit() {
  categoryApiParams.namespace = props.rowData?.namespace || '';
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    model.namespace = props.rowData?.namespace || '';
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

const {
  handleSelectQuery: handleSelectCategory,
  loading: ctLoading,
  selectOptions: categorySelectOptions
} = useSelect<string>({
  apiFn: fetchAllCategory,
  apiParams: categoryApiParams,
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

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  if (props.operateType === 'add') {
    const res = await newCocoConfig(model as CocoApi.CocoConfig.CocoConfig);
    if (res && res.data) {
      window.$message?.success($t('common.addSuccess'));
      closeDrawer();
      emit('submitted');
      return;
    }
    window.$message?.error('添加失败');
  }
  if (props.operateType === 'edit') {
    const res = await updateCocoConfig(model as CocoApi.CocoConfig.CocoConfig);
    if (res && res.data) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer();
      emit('submitted');
      return;
    }
    window.$message?.error('更新失败');
  }
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="命名空间" path="namespace" required>
          <NInput v-model:value="model.namespace" disabled />
        </NFormItem>
        <NFormItem label="配置键" path="key" required>
          <NInput v-model:value="model.key" :disabled="!keyEditable" />
        </NFormItem>
        <NFormItem label="配置目录" path="category">
          <NSelect
            v-model:value="model.category"
            :options="categorySelectOptions"
            :loading="ctLoading"
            filterable
            tag
            :on-update-show="updateCategoryShow"
            :on-search="handleSelectCategory"
          />
        </NFormItem>
        <NFormItem label="值类型" path="keyType">
          <NInput v-model:value="model.keyType" />
        </NFormItem>
        <NFormItem label="配置值" path="value" required>
          <NInput
            v-model:value="model.value"
            type="textarea"
            size="small"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
        </NFormItem>
        <NFormItem label="描述" path="desc">
          <NInput
            v-model:value="model.desc"
            placeholder="描述配置的用途"
            type="textarea"
            size="small"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
