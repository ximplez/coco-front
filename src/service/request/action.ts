import type { ErrorCodeHandle } from '~/packages/axios';
import { useAuthStore } from '@/store/modules/auth';

export const actionIdempotent = createAction({
  async handle(response, instance) {
    return response;
  }
});

export const actionAuthenticationFail = createAction({
  async handle(response, instance) {
    const authStore = useAuthStore();
    await authStore.resetStore();
    return null;
  }
});

function createAction(options?: Partial<ErrorCodeHandle>) {
  const opts: ErrorCodeHandle<any> = {
    handle: async () => {}
  };

  Object.assign(opts, options);

  return opts;
}
