<script setup lang="ts">
defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  itemAlign?: NaiveUI.Align;
  disabledDelete?: boolean;
  loading?: boolean;
  needRefresh?: boolean;
  extraData?: Record<string, unknown>;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;

  (e: 'delete'): void;

  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

// const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
//   default: () => []
// });

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <NSpace :align="itemAlign" wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <NButton size="small" ghost type="primary" :disabled="!extraData?.namespace" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <NPopconfirm @positive-click="batchDelete">
        <template #trigger>
          <NButton size="small" ghost type="error" :disabled="disabledDelete">
            <template #icon>
              <icon-ic-round-delete class="text-icon" />
            </template>
            {{ $t('common.batchDelete') }}
          </NButton>
        </template>
        {{ $t('common.confirmDelete') }}
      </NPopconfirm>
    </slot>
    <NButton v-if="needRefresh" size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </NButton>
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
