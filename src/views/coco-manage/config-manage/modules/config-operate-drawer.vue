<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useCocoFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

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

type Model = Pick<CocoApi.CocoConfig.CocoConfig, 'nameSpace' | 'category' | 'key' | 'value' | 'keyType' | 'desc'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    nameSpace: props.rowData?.nameSpace || '',
    category: '',
    key: '',
    value: '',
    keyType: '',
    desc: ''
  };
}

type RuleKey = Extract<keyof Model, 'nameSpace' | 'key' | 'value'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useCocoFormRules(); // inside computed to make locale reactive

  return {
    nameSpace: patternRules.nameSpace,
    key: patternRules.key,
    value: patternRules.value
  };
});

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    model.nameSpace = props.rowData?.nameSpace || '';
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  console.log(model);
  await validate();
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
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
        <NFormItem label="命名空间" path="nameSpace" required>
          <NInput v-model:value="model.nameSpace" disabled />
        </NFormItem>
        <NFormItem label="配置键" path="key" required>
          <NInput v-model:value="model.key" :disabled="!keyEditable" />
        </NFormItem>
        <NFormItem label="配置目录" path="category" required>
          <NInput v-model:value="model.category" />
        </NFormItem>
        <NFormItem label="值类型" path="keyType" required>
          <NInput v-model:value="model.keyType" />
        </NFormItem>
        <NFormItem label="配置值" path="value" required>
          <NInput v-model:value="model.value" />
        </NFormItem>
        <NFormItem label="描述" path="desc">
          <NInput v-model:value="model.desc" placeholder="描述配置的用途" />
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
