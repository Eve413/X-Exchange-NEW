/**
 * 表单验证工具函数
 */

// 手机号验证
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 邮箱验证
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 密码强度验证
export const validatePassword = (password: string): {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong'
  errors: string[]
} => {
  const errors: string[] = []
  let score = 0

  // 长度检查
  if (password.length < 8) {
    errors.push('密码长度至少8位')
  } else if (password.length >= 12) {
    score += 2
  } else {
    score += 1
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 1
  } else {
    errors.push('密码必须包含数字')
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    errors.push('密码必须包含小写字母')
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    errors.push('密码必须包含大写字母')
  }

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (score >= 5) {
    strength = 'strong'
  } else if (score >= 3) {
    strength = 'medium'
  }

  return {
    isValid: errors.length === 0 && password.length >= 8,
    strength,
    errors
  }
}

// 资金密码验证（6位数字）
export const validateFundPassword = (password: string): boolean => {
  const fundPasswordRegex = /^\d{6}$/
  return fundPasswordRegex.test(password)
}

// 短信验证码验证（6位数字）
export const validateSmsCode = (code: string): boolean => {
  const smsCodeRegex = /^\d{6}$/
  return smsCodeRegex.test(code)
}

// 图形验证码验证（4位字母数字）
export const validateCaptcha = (code: string): boolean => {
  const captchaRegex = /^[a-zA-Z0-9]{4}$/
  return captchaRegex.test(code)
}

// 2FA验证码验证（6位数字）
export const validate2FA = (code: string): boolean => {
  const tfaRegex = /^\d{6}$/
  return tfaRegex.test(code)
}

// 邀请码验证（6-12位字母数字）
export const validateInviteCode = (code: string): boolean => {
  const inviteCodeRegex = /^[a-zA-Z0-9]{6,12}$/
  return inviteCodeRegex.test(code)
}

// 实名认证姓名验证
export const validateRealName = (name: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,10}$/
  return nameRegex.test(name)
}

// 身份证号验证
export const validateIdCard = (idCard: string): boolean => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return idCardRegex.test(idCard)
}

// 银行卡号验证
export const validateBankCard = (cardNumber: string): boolean => {
  const bankCardRegex = /^\d{16,19}$/
  return bankCardRegex.test(cardNumber)
}

// 通用表单验证规则
export const validationRules = {
  phone: {
    required: true,
    validator: validatePhone,
    message: '请输入正确的手机号'
  },
  email: {
    required: true,
    validator: validateEmail,
    message: '请输入正确的邮箱地址'
  },
  password: {
    required: true,
    validator: (value: string) => validatePassword(value).isValid,
    message: '密码格式不正确'
  },
  fundPassword: {
    required: true,
    validator: validateFundPassword,
    message: '资金密码必须为6位数字'
  },
  smsCode: {
    required: true,
    validator: validateSmsCode,
    message: '短信验证码必须为6位数字'
  },
  captcha: {
    required: true,
    validator: validateCaptcha,
    message: '图形验证码必须为4位字母或数字'
  },
  twoFA: {
    required: true,
    validator: validate2FA,
    message: '2FA验证码必须为6位数字'
  },
  inviteCode: {
    required: false,
    validator: validateInviteCode,
    message: '邀请码格式不正确'
  },
  realName: {
    required: true,
    validator: validateRealName,
    message: '请输入正确的中文姓名'
  },
  idCard: {
    required: true,
    validator: validateIdCard,
    message: '请输入正确的身份证号'
  },
  bankCard: {
    required: true,
    validator: validateBankCard,
    message: '请输入正确的银行卡号'
  }
}

// 表单验证器类
export class FormValidator {
  private errors: Record<string, string> = {}

  // 验证单个字段
  validateField(field: string, value: any, rules: any): boolean {
    if (rules.required && (!value || value.toString().trim() === '')) {
      this.errors[field] = `${field}不能为空`
      return false
    }

    if (value && rules.validator && !rules.validator(value)) {
      this.errors[field] = rules.message || `${field}格式不正确`
      return false
    }

    delete this.errors[field]
    return true
  }

  // 验证整个表单
  validateForm(formData: Record<string, any>, rules: Record<string, any>): boolean {
    this.errors = {}
    let isValid = true

    for (const field in rules) {
      if (!this.validateField(field, formData[field], rules[field])) {
        isValid = false
      }
    }

    return isValid
  }

  // 获取错误信息
  getErrors(): Record<string, string> {
    return { ...this.errors }
  }

  // 获取单个字段错误
  getFieldError(field: string): string | undefined {
    return this.errors[field]
  }

  // 清除错误
  clearErrors(): void {
    this.errors = {}
  }

  // 清除单个字段错误
  clearFieldError(field: string): void {
    delete this.errors[field]
  }
}

export default {
  validatePhone,
  validateEmail,
  validatePassword,
  validateFundPassword,
  validateSmsCode,
  validateCaptcha,
  validate2FA,
  validateInviteCode,
  validateRealName,
  validateIdCard,
  validateBankCard,
  validationRules,
  FormValidator
}