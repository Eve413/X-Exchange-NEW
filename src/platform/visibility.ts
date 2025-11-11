/**
 * 页面可见性适配层 - 统一处理页面显隐事件
 * 解决多端生命周期差异问题
 */
import type { OnShowOptions } from '@dcloudio/uni-app'

export interface VisibilityCallbacks {
  show?: (options?: OnShowOptions) => void
  hide?: () => void
}

/**
 * 页面可见性监听器
 * 在组件中配合 onShow/onHide 使用
 */
export function onVisible(callbacks: VisibilityCallbacks) {
  // #ifdef H5
  const handleVisibilityChange = () => {
    if (document.hidden) {
      callbacks.hide?.()
    } else {
      callbacks.show?.()
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  // #endif
  
  // #ifndef H5
  // 在非H5端，需要通过页面生命周期手动调用
  // 这里返回一个工具函数，供页面生命周期使用
  return {
    triggerShow: (options?: OnShowOptions) => callbacks.show?.(options),
    triggerHide: () => callbacks.hide?.()
  }
  // #endif
}

/**
 * 检查页面是否可见
 */
export function isPageVisible(): boolean {
  // #ifdef H5
  return !document.hidden
  // #endif
  
  // #ifndef H5
  // 非H5端默认认为页面可见
  return true
  // #endif
}

/**
 * 页面焦点状态监听
 */
export function onFocus(callback: () => void) {
  // #ifdef H5
  window.addEventListener('focus', callback)
  return () => window.removeEventListener('focus', callback)
  // #endif
  
  // #ifndef H5
  // 非H5端通过页面生命周期处理
  return {
    triggerFocus: callback
  }
  // #endif
}

/**
 * 页面失焦状态监听
 */
export function onBlur(callback: () => void) {
  // #ifdef H5
  window.addEventListener('blur', callback)
  return () => window.removeEventListener('blur', callback)
  // #endif
  
  // #ifndef H5
  // 非H5端通过页面生命周期处理
  return {
    triggerBlur: callback
  }
  // #endif
}
