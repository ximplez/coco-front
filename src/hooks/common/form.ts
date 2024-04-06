import type { ComputedRef, Ref } from 'vue';
import { ref, toValue } from 'vue';
import type { FormInst } from 'naive-ui';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';
import { $t } from '@/locales';

export function useFormRules() {
  const patternRules = {
    userName: {
      pattern: REG_USER_NAME,
      message: $t('form.userName.invalid'),
      trigger: 'change'
    },
    phone: {
      pattern: REG_PHONE,
      message: $t('form.phone.invalid'),
      trigger: 'change'
    },
    pwd: {
      pattern: REG_PWD,
      message: $t('form.pwd.invalid'),
      trigger: 'change'
    },
    code: {
      pattern: REG_CODE_SIX,
      message: $t('form.code.invalid'),
      trigger: 'change'
    },
    email: {
      pattern: REG_EMAIL,
      message: $t('form.email.invalid'),
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    userName: [createRequiredRule($t('form.userName.required')), patternRules.userName],
    phone: [createRequiredRule($t('form.phone.required')), patternRules.phone],
    pwd: [createRequiredRule($t('form.pwd.required')), patternRules.pwd],
    code: [createRequiredRule($t('form.code.required')), patternRules.code],
    email: [createRequiredRule($t('form.email.required')), patternRules.email]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message,
      trigger: ['input', 'blur']
    };
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>) {
    const confirmPwdRule: App.Global.FormRule[] = [
      { required: true, message: $t('form.confirmPwd.required') },
      {
        asyncValidator: (rule, value) => {
          if (value.trim() !== '' && value !== toValue(pwd)) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        },
        message: $t('form.confirmPwd.invalid'),
        trigger: 'input'
      }
    ];
    return confirmPwdRule;
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  };
}

export function useCocoFormRules() {
  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));
  const patternRules = {
    nameSpace: {
      type: 'regexp',
      pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]{1,50}$/,
      min: 1,
      message: 'nameSpace 格式不正确',
      trigger: ['input', 'blur', 'change']
    },
    key: {
      type: 'regexp',
      pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]{1,50}$/,
      message: 'key 格式不正确',
      trigger: 'change'
    },
    value: {
      type: 'regexp',
      pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]{1,50}$/,
      message: 'value 格式不正确',
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    nameSpace: [createRequiredRule('nameSpace 不可为空'), patternRules.nameSpace],
    key: [createRequiredRule('key 不可为空'), patternRules.key],
    value: [createRequiredRule('value 不可为空'), patternRules.value]
  } satisfies Record<string, App.Global.FormRule[]>;

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message,
      trigger: ['input', 'blur', 'change']
    };
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule
  };
}

export function useNaiveForm() {
  const formRef = ref<FormInst | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  async function restoreValidation() {
    formRef.value?.restoreValidation();
  }

  return {
    formRef,
    validate,
    restoreValidation
  };
}
