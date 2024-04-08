import type { ErrorCodeHandle } from '~/packages/axios';
import { actionAuthenticationFail, actionIdempotent } from '@/service/request/action';

export const codeActions: Map<Api.ErrorCode.Code, ErrorCodeHandle> = new Map([
  ['1', actionIdempotent],
  ['1005', actionAuthenticationFail],
  ['1006', actionAuthenticationFail]
]);
