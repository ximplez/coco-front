<script setup lang="tsx">
import { NButton } from 'naive-ui';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchCocoConfig } from '@/service/api/coco-config';
import ConfigSearch from './modules/config-search.vue';
import ConfigOperateDrawer from './modules/config-operate-drawer.vue';

const appStore = useAppStore();

const { columns, columnChecks, data, getData, loading, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchCocoConfig,
  apiParams: {
    current: 1,
    size: 10,
    nameSpace: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'key',
      title: '配置键',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'value',
      title: '配置值',
      align: 'center',
      width: 100
    },
    {
      key: 'category',
      title: '目录',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'desc',
      title: '描述',
      align: 'center',
      width: 120
    },
    {
      key: 'updateTime',
      title: '更新时间',
      align: 'center',
      minWidth: 200,
      render: row => (
        <div class="flex-center gap-8px">
          <NTime v-time="row.updateTime" format="yyyy-MM-dd HH:mm:ss" />
        </div>
      )
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
      width: 100,
      render: row => (
        <div class="flex-center gap-8px">
          <NTime v-time="row.createTime" format="yyyy-MM-dd HH:mm:ss" />
        </div>
      )
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ConfigSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard title="配置列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <ConfigOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
