/**
 * 平台适配层统一导出
 */
export * from './theme'
export * from './viewport'
export * from './visibility'

/**
 * 平台检测工具
 */
export function getPlatform() {
  // #ifdef H5
  return 'h5'
  // #endif
  
  // #ifdef APP-PLUS
  return 'app'
  // #endif
  
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
  
  // #ifdef MP-ALIPAY
  return 'mp-alipay'
  // #endif
  
  // #ifdef MP-BAIDU
  return 'mp-baidu'
  // #endif
  
  // #ifdef MP-TOUTIAO
  return 'mp-toutiao'
  // #endif
  
  // #ifdef MP-QQ
  return 'mp-qq'
  // #endif
  
  // #ifdef MP-KUAISHOU
  return 'mp-kuaishou'
  // #endif
  
  // #ifdef MP-LARK
  return 'mp-lark'
  // #endif
  
  // #ifdef MP-JD
  return 'mp-jd'
  // #endif
  
  // #ifdef MP-360
  return 'mp-360'
  // #endif
  
  // #ifdef QUICKAPP-WEBVIEW
  return 'quickapp-webview'
  // #endif
  
  // #ifdef QUICKAPP-WEBVIEW-UNION
  return 'quickapp-webview-union'
  // #endif
  
  // #ifdef QUICKAPP-WEBVIEW-HUAWEI
  return 'quickapp-webview-huawei'
  // #endif
  
  return 'unknown'
}

/**
 * 检查是否为H5平台
 */
export function isH5() {
  return getPlatform() === 'h5'
}

/**
 * 检查是否为App平台
 */
export function isApp() {
  return getPlatform() === 'app'
}

/**
 * 检查是否为小程序平台
 */
export function isMiniProgram() {
  const platform = getPlatform()
  return platform.startsWith('mp-')
}
