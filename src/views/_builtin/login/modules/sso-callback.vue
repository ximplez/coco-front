<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';
import { SsoAuthor } from '@/enum';
import { useBoolean, useLoading } from '~/packages/hooks';

defineOptions({
  name: 'SsoCallback'
});

const route = useRoute();
const routerPush = useRouterPush();
const authStore = useAuthStore();

const { loading: loginLoading, startLoading, endLoading } = useLoading();
const { bool: loginRes, setBool: setLoginRes } = useBoolean(false);

onBeforeMount(async () => {
  startLoading();
  setLoginRes(
    await authStore.loginSso(String(route.params.author), String(route.query.code), String(route.query.state))
  );
  endLoading();
});

async function toggleSsoLogin(author: string) {
  const url = await authStore.fetchSsoUrl(author);
  if (url) {
    window.open(url, '_self');
  } else {
    routerPush.toLogin();
  }
}
</script>

<template>
  <NSpace vertical :size="18" class="w-full">
    <!--  登录中  -->
    <NGradientText v-if="loginLoading" type="warning">登录中...</NGradientText>
    <!--  登录失败  -->
    <NGradientText v-if="!loginLoading && !loginRes" type="error">登录失败</NGradientText>
    <NGrid v-if="!loginLoading && !loginRes" cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in SsoAuthor" :key="item">
        <NButton size="large" type="info" round secondary block @click="toggleSsoLogin(item)">
          {{ item }}
        </NButton>
      </NGi>
    </NGrid>
    <!--  登录成功  -->
    <NGradientText v-if="!loginLoading && loginRes" type="info">登录成功，正在跳转...</NGradientText>
  </NSpace>
</template>

<style scoped></style>

<style scoped></style>
