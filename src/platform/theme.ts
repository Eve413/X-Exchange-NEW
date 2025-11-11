/**
 * 主题适配层 - 统一处理系统主题检测
 * 解决多端主题API差异问题
 */

export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 获取系统主题
 */
export function getSystemTheme(): 'light' | 'dark' {
  // #ifdef H5
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
  return mq && mq.matches ? 'dark' : 'light'
  // #endif
  
  // #ifdef APP-PLUS || MP
  try {
    const t = (uni.getSystemInfoSync()?.theme as 'light' | 'dark' | undefined)
    return t || 'light'
  } catch {
    return 'light'
  }
  // #endif
  
  // #ifndef H5 || APP-PLUS || MP
  return 'light'
  // #endif
}

/**
 * 监听系统主题变化
 */
export function onSystemThemeChange(callback: (theme: 'light' | 'dark') => void) {
  // #ifdef H5
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
  if (mq) {
    const handler = () => callback(mq.matches ? 'dark' : 'light')
    // 兼容新旧 API
    if ('addEventListener' in mq) {
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else if ('addListener' in mq) {
      (mq as any).addListener(handler)
      return () => (mq as any).removeListener(handler)
    }
  }
  return () => {}
  // #endif
  
  // #ifndef H5
  // 非H5端暂不支持主题变化监听
  return () => {}
  // #endif
}

/**
 * 获取当前应用主题
 */
export function getAppTheme(): ThemeMode {
  try {
    return uni.getStorageSync('theme') || 'auto'
  } catch {
    return 'auto'
  }
}

/**
 * 设置应用主题
 */
export function setAppTheme(theme: ThemeMode) {
  try {
    uni.setStorageSync('theme', theme)
  } catch (error) {
    console.error('设置主题失败:', error)
  }
}

/**
 * 获取实际生效的主题
 */
export function getEffectiveTheme(): 'light' | 'dark' {
  const appTheme = getAppTheme()
  
  if (appTheme === 'auto') {
    return getSystemTheme()
  }
  
  return appTheme as 'light' | 'dark'
}

/**
 * 主题变化监听器（包含应用主题和系统主题）
 */
export function onThemeChange(callback: (theme: 'light' | 'dark') => void) {
  const systemThemeUnsubscribe = onSystemThemeChange(callback)
  
  // 监听存储变化（应用主题变化）
  // #ifdef H5
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'theme') {
      callback(getEffectiveTheme())
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  const appThemeUnsubscribe = () => window.removeEventListener('storage', handleStorageChange)
  // #endif
  
  // #ifndef H5
  const appThemeUnsubscribe = () => {}
  // #endif
  
  return () => {
    systemThemeUnsubscribe()
    appThemeUnsubscribe()
  }
}
