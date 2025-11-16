import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 创建pinia实例
export const pinia = createPinia()

// 配置持久化插件
pinia.use(createPersistedState({
  storage: {
    getItem: (key: string) => {
      return uni.getStorageSync(key)
    },
    setItem: (key: string, value: string) => {
      uni.setStorageSync(key, value)
    }
  }
}))

export default pinia

// 导出所有store模块
export * from './modules/app'
export * from './modules/user'
export * from './modules/notification'
export * from './modules/system'
export * from './modules/websocket'
export * from './modules/assets'
export * from './modules/trading'
export * from './market'
export * from './trade' 