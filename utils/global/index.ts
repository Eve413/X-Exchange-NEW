import { NumberFormat, DateFormat, StringFormat } from '../format'
import { storage } from '../storage'
import { AuthUtils } from '../auth'

/**
 * 设置全局属性和方法
 * @param app Vue应用实例
 */
export function setupGlobalProperties(app: any) {
  // 全局工具函数
  app.config.globalProperties.$format = {
    number: NumberFormat,
    date: DateFormat,
    string: StringFormat
  }
  
  // 全局存储工具
  app.config.globalProperties.$storage = storage
  
  // 全局认证工具
  app.config.globalProperties.$auth = AuthUtils
  
  // 全局常量
  app.config.globalProperties.$constants = {
    APP_NAME: 'X交易所',
    VERSION: '1.0.0',
    AUTHOR: 'Winnie413'
  }
  
  // 全局方法
  app.config.globalProperties.$utils = {
    // 复制到剪贴板
    copyText: (text: string) => {
      // #ifdef H5
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      // #endif
      
      // #ifdef MP
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({ title: '复制成功', icon: 'success' })
        }
      })
      // #endif
      
      // #ifdef APP-PLUS
      plus.os.setClipboardText(text)
      uni.showToast({ title: '复制成功', icon: 'success' })
      // #endif
    },
    
    // 防抖函数
    debounce: (fn: Function, delay: number = 300) => {
      let timer: any = null
      return function (this: any, ...args: any[]) {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
      }
    },
    
    // 节流函数  
    throttle: (fn: Function, delay: number = 300) => {
      let lastTime = 0
      return function (this: any, ...args: any[]) {
        const now = Date.now()
        if (now - lastTime >= delay) {
          lastTime = now
          fn.apply(this, args)
        }
      }
    }
  }
}

// 全局属性类型定义
export interface GlobalProperties {
  $format: {
    number: typeof NumberFormat
    date: typeof DateFormat  
    string: typeof StringFormat
  }
  $storage: typeof storage
  $auth: typeof AuthUtils
  $constants: {
    APP_NAME: string
    VERSION: string
    AUTHOR: string
  }
  $utils: {
    copyText: (text: string) => void
    debounce: (fn: Function, delay?: number) => Function
    throttle: (fn: Function, delay?: number) => Function
  }
} 