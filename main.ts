// 在任何其他导入之前导入polyfill - 防止非H5端白屏
import './utils/polyfill'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createSSRApp } from 'vue'
import App from './App.vue'

// 全局错误处理 - 在应用启动前设置
// #ifdef H5
window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event.reason?.message || event.reason || event)
  if (msg.includes('Failed to fetch dynamically imported module')) {
    console.error('[动态导入失败] 这通常是用了变量路径 import(.vue)。请换 import.meta.glob。', event.reason)
  } else {
    console.error('[UnhandledRejection]', event.reason || event)
  }
})

window.addEventListener('error', (event) => {
  console.error('[全局错误]', event.error || event.message)
})
// #endif

// #ifndef H5
// 非H5端使用uni的错误处理
uni.onError((error) => {
  console.error('[全局错误]', error)
})
// #endif

// 开发模式下测试Intl可用性已移除，避免Vite导入分析问题

// 导入全局样式
import './styles/index.scss'

// 导入工具函数
import { setupGlobalProperties } from './utils/global/index'

// 导入新的i18n配置
import { i18n, tl } from './utils/i18n/setup'

export function createApp() {
  const app = createSSRApp(App)
  
  // 配置Pinia状态管理
  const pinia = createPinia()
  // 启用持久化插件 (优化版本)
  pinia.use(createPersistedState({
    storage: {
      getItem: (key: string) => {
        try {
          return uni.getStorageSync(key)
        } catch (error) {
          console.error('Storage getItem error:', error)
          return null
        }
      },
      setItem: (key: string, value: any) => {
        try {
          uni.setStorageSync(key, value)
        } catch (error) {
          console.error('Storage setItem error:', error)
        }
      },
      removeItem: (key: string) => {
        try {
          uni.removeStorageSync(key)
        } catch (error) {
          console.error('Storage removeItem error:', error)
        }
      }
    },
    // 默认持久化所有store，可以在store中单独配置
    auto: true,
    // 序列化配置
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }))
  
  // 安装插件
  app.use(pinia)
  app.use(i18n)
  
  // 设置全局属性和方法
  setupGlobalProperties(app)
  
  // 添加全局翻译函数
  app.config.globalProperties.$tl = tl
  
  return {
    app,
    Pinia: pinia
  }
}