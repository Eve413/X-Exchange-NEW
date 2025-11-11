/**
 * 本地存储工具类
 * 支持同步和异步操作，自动JSON序列化
 */

export interface StorageData {
  value: any
  expire?: number
}

class Storage {
  /**
   * 设置存储数据（同步）
   * @param key 存储键
   * @param value 存储值
   * @param expire 过期时间（毫秒）
   */
  setSync(key: string, value: any, expire?: number): boolean {
    try {
      const data: StorageData = {
        value,
        expire: expire ? Date.now() + expire : undefined
      }
      uni.setStorageSync(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Storage setSync error:', error)
      return false
    }
  }

  /**
   * 获取存储数据（同步）
   * @param key 存储键
   * @param defaultValue 默认值
   */
  getSync<T = any>(key: string, defaultValue?: T): T | undefined {
    try {
      const dataStr = uni.getStorageSync(key)
      if (!dataStr) return defaultValue

      const data: StorageData = JSON.parse(dataStr)
      
      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        this.removeSync(key)
        return defaultValue
      }

      return data.value as T
    } catch (error) {
      console.error('Storage getSync error:', error)
      return defaultValue
    }
  }

  /**
   * 设置存储数据（异步）
   * @param key 存储键
   * @param value 存储值
   * @param expire 过期时间（毫秒）
   */
  async set(key: string, value: any, expire?: number): Promise<boolean> {
    try {
      const data: StorageData = {
        value,
        expire: expire ? Date.now() + expire : undefined
      }
      await uni.setStorage({
        key,
        data: JSON.stringify(data)
      })
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }

  /**
   * 获取存储数据（异步）
   * @param key 存储键
   * @param defaultValue 默认值
   */
  async get<T = any>(key: string, defaultValue?: T): Promise<T | undefined> {
    try {
      const res = await uni.getStorage({ key })
      const data: StorageData = JSON.parse(res.data)
      
      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        await this.remove(key)
        return defaultValue
      }

      return data.value as T
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  }

  /**
   * 删除存储数据（同步）
   * @param key 存储键
   */
  removeSync(key: string): boolean {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('Storage removeSync error:', error)
      return false
    }
  }

  /**
   * 删除存储数据（异步）
   * @param key 存储键
   */
  async remove(key: string): Promise<boolean> {
    try {
      await uni.removeStorage({ key })
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  /**
   * 清空所有存储（同步）
   */
  clearSync(): boolean {
    try {
      uni.clearStorageSync()
      return true
    } catch (error) {
      console.error('Storage clearSync error:', error)
      return false
    }
  }

  /**
   * 清空所有存储（异步）
   */
  async clear(): Promise<boolean> {
    try {
      await uni.clearStorage()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }

  /**
   * 获取存储信息
   */
  getInfo() {
    try {
      return uni.getStorageInfoSync()
    } catch (error) {
      console.error('Storage getInfo error:', error)
      return null
    }
  }

  /**
   * 检查键是否存在
   * @param key 存储键
   */
  has(key: string): boolean {
    try {
      const value = uni.getStorageSync(key)
      return value !== ''
    } catch (error) {
      return false
    }
  }
}

// 创建实例
export const storage = new Storage()

// 常用存储键名常量
export const STORAGE_KEYS = {
  TOKEN: 'user_token',
  TOKEN_LOGIN: 'user_token_login',
  USER_INFO: 'user_info',
  LANGUAGE: 'app_language',
  THEME: 'app_theme',
  SETTINGS: 'app_settings',
  TRADING_PAIRS: 'trading_pairs',
  FAVORITES: 'user_favorites',
  RECENT_SEARCH: 'recent_search'
} as const

export default storage 