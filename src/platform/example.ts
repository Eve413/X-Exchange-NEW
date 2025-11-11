/**
 * 平台适配层使用示例
 * 展示如何正确使用适配层API替代直接使用浏览器API
 */

import { getPlatform, isApp, isH5, isMiniProgram } from '@/platform'
import { getAppTheme, getEffectiveTheme, getSystemTheme, onSystemThemeChange, onThemeChange, setAppTheme } from '@/platform/theme'
import { getDevicePixelRatio, getViewportSize, onResize } from '@/platform/viewport'
import { isPageVisible, onBlur, onFocus, onVisible } from '@/platform/visibility'

// 示例1: 视口适配
export function setupViewportAdapter() {
  // ✅ 正确：使用适配层
  const unsubscribeResize = onResize(() => {
    const size = getViewportSize()
    const dpr = getDevicePixelRatio()
    console.log('视口尺寸变化:', size, '设备像素比:', dpr)
  })
  
  // ❌ 错误：直接使用浏览器API（在非H5端会报错）
  // window.addEventListener('resize', () => {})
  
  return unsubscribeResize
}

// 示例2: 页面可见性适配
export function setupVisibilityAdapter() {
  // ✅ 正确：使用适配层
  const unsubscribeVisible = onVisible({
    show: (options) => {
      console.log('页面显示:', options)
    },
    hide: () => {
      console.log('页面隐藏')
    }
  })
  
  // ✅ 正确：检查页面可见性
  const visible = isPageVisible()
  console.log('页面是否可见:', visible)
  
  return unsubscribeVisible
}

// 示例3: 主题适配
export function setupThemeAdapter() {
  // ✅ 正确：使用适配层
  const systemTheme = getSystemTheme()
  const appTheme = getAppTheme()
  const effectiveTheme = getEffectiveTheme()
  
  console.log('系统主题:', systemTheme)
  console.log('应用主题:', appTheme)
  console.log('生效主题:', effectiveTheme)
  
  // ✅ 正确：监听主题变化
  const unsubscribeTheme = onThemeChange((theme) => {
    console.log('主题变化:', theme)
  })
  
  // ✅ 正确：设置应用主题
  setAppTheme('dark')
  
  return unsubscribeTheme
}

// 示例4: 平台检测
export function setupPlatformDetection() {
  const platform = getPlatform()
  console.log('当前平台:', platform)
  
  if (isH5()) {
    console.log('运行在H5环境')
  } else if (isApp()) {
    console.log('运行在App环境')
  } else if (isMiniProgram()) {
    console.log('运行在小程序环境')
  }
}

// 示例5: 在Vue组件中使用
export function usePlatformAdapter() {
  return {
    // 视口相关
    onResize,
    getViewportSize,
    getDevicePixelRatio,
    
    // 可见性相关
    onVisible,
    isPageVisible,
    onFocus,
    onBlur,
    
    // 主题相关
    getSystemTheme,
    onSystemThemeChange,
    getAppTheme,
    setAppTheme,
    getEffectiveTheme,
    onThemeChange,
    
    // 平台检测
    getPlatform,
    isH5,
    isApp,
    isMiniProgram
  }
}
