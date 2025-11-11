import enUS from '@/locales/en-US.json'
import zhCN from '@/locales/zh-CN.json'
import zhTW from '@/locales/zh-TW.json'
import { createI18n } from 'vue-i18n'

export type Locale = 'zh-CN' | 'en-US' | 'zh-TW'

export const SUPPORTED_LOCALES: Locale[] = ['zh-CN', 'en-US', 'zh-TW']
export const LOCALE_STORAGE_KEY = 'locale'

// 语言代码归一化函数
function normalizeLocale(input?: string): 'zh-CN' | 'zh-TW' | 'en-US' {
  const raw = (input || '').toLowerCase().replace('_', '-')
  if (raw.startsWith('zh-tw') || raw.startsWith('zh-hk')) return 'zh-TW'
  if (raw.startsWith('zh')) return 'zh-CN'
  if (raw.startsWith('en')) return 'en-US'
  return 'zh-CN' // 默认语言
}

function detectLocale(): Locale {
  // 检查新的存储键
  const saved = uni.getStorageSync(LOCALE_STORAGE_KEY) as Locale | ''
  if (SUPPORTED_LOCALES.includes(saved as Locale)) return saved as Locale
  
  // 兼容旧的存储键 'app.locale'
  const oldSaved = uni.getStorageSync('app.locale') as Locale | ''
  if (SUPPORTED_LOCALES.includes(oldSaved as Locale)) {
    // 迁移到新的存储键
    uni.setStorageSync(LOCALE_STORAGE_KEY, oldSaved)
    uni.removeStorageSync('app.locale')
    return oldSaved as Locale
  }
  
  // 安全的系统语言检测 - 兼容小程序环境
  try {
    // 优先使用uni.getSystemInfoSync获取系统语言
    const systemInfo = uni.getSystemInfoSync()
    const language = systemInfo.language || systemInfo.lang || 'zh-CN'
    
    // 使用归一化函数处理系统语言
    return normalizeLocale(language)
  } catch (e) {
    console.warn('获取系统语言失败，使用默认语言', e)
  }
  
  // 默认使用简体中文
  return 'zh-CN'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectLocale(),
  fallbackLocale: ['zh-CN', 'en-US'], // 有 zh-CN 就不会去找 zh
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'zh-TW': zhTW,
  },
  // 禁用vue-i18n的内置数字和日期格式化（避免Intl依赖）
  numberFormats: {},
  datetimeFormats: {},
  // 开发期先降噪，避免刷屏
  missingWarn: false,
  fallbackWarn: false,
  // 设置为 'off' 来禁用所有warn信息
  warnHtmlMessage: false
})

// 运行时切换（支持热切换，不刷新页面）
export function setLocale(locale: Locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  i18n.global.locale.value = locale
  uni.setStorageSync(LOCALE_STORAGE_KEY, locale)
}

// 可选：按需动态注入消息（做懒加载时用）
export function setLocaleMessages(locale: Locale, messages: Record<string, any>) {
  i18n.global.setLocaleMessage(locale, messages)
}

// 带默认值的翻译函数 - 优雅回退到原文
export function tl(key: string, params?: any): string {
  const g = i18n.global
  // 1) 如果消息里确有这个 key，正常返回
  if (g.te(key)) return g.t(key, params as any)
  // 2) 如果形如 "hero.cta|Launch now"（带默认值），拆分后取右侧
  const parts = key.split('|')
  if (parts.length > 1 && parts[1].trim()) return parts[1].trim()
  // 3) 否则把 key 当作文案原样返回（不再刷 warning）
  return key
}