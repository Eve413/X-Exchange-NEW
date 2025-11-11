/**
 * 视口适配层 - 统一处理窗口尺寸变化事件
 * 解决多端兼容性问题，避免直接使用 window.addEventListener
 */

export function onResize(cb: Function) {
  // #ifdef H5
  window.addEventListener('resize', cb as any)
  return () => window.removeEventListener('resize', cb as any)
  // #endif
  
  // #ifndef H5
  uni.onWindowResize(cb as any)
  return () => uni.offWindowResize(cb as any)
  // #endif
}

/**
 * 获取窗口尺寸信息
 */
export function getViewportSize() {
  // #ifdef H5
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
  // #endif
  
  // #ifndef H5
  const systemInfo = uni.getSystemInfoSync()
  return {
    width: systemInfo.windowWidth,
    height: systemInfo.windowHeight
  }
  // #endif
}

/**
 * 获取设备像素比
 */
export function getDevicePixelRatio() {
  // #ifdef H5
  return window.devicePixelRatio || 1
  // #endif
  
  // #ifndef H5
  const systemInfo = uni.getSystemInfoSync()
  return systemInfo.pixelRatio || 1
  // #endif
}
