/**
 * 存储工具类测试
 */
import { storage, STORAGE_KEYS } from '@/utils/storage'

describe('Storage', () => {
  beforeEach(() => {
    // 清理mock调用记录
    jest.clearAllMocks()
  })

  describe('setSync and getSync', () => {
    it('should store and retrieve data synchronously', () => {
      const testData = { name: 'test', value: 123 }
      const key = 'test-key'

      // 模拟存储成功
      ;(uni.getStorageSync as jest.Mock).mockReturnValue(JSON.stringify({
        value: testData
      }))

      // 存储数据
      const result = storage.setSync(key, testData)
      expect(result).toBe(true)
      expect(uni.setStorageSync).toHaveBeenCalledWith(key, JSON.stringify({ value: testData }))

      // 获取数据
      const retrieved = storage.getSync(key)
      expect(retrieved).toEqual(testData)
      expect(uni.getStorageSync).toHaveBeenCalledWith(key)
    })

    it('should handle storage with expiration', () => {
      const testData = 'test-value'
      const key = 'test-key'
      const expireTime = Date.now() + 10000 // 10秒后过期

      // 模拟未过期的数据
      ;(uni.getStorageSync as jest.Mock).mockReturnValue(JSON.stringify({
        value: testData,
        expire: expireTime
      }))

      const result = storage.setSync(key, testData, 10000)
      expect(result).toBe(true)

      const retrieved = storage.getSync(key)
      expect(retrieved).toBe(testData)
    })

    it('should handle expired data', () => {
      const testData = 'test-value'
      const key = 'test-key'
      const expireTime = Date.now() - 1000 // 1秒前已过期

      // 模拟过期的数据
      ;(uni.getStorageSync as jest.Mock).mockReturnValue(JSON.stringify({
        value: testData,
        expire: expireTime
      }))

      const retrieved = storage.getSync(key, 'default-value')
      expect(retrieved).toBe('default-value')
      expect(uni.removeStorageSync).toHaveBeenCalledWith(key)
    })

    it('should return default value when key not exists', () => {
      ;(uni.getStorageSync as jest.Mock).mockReturnValue('')

      const result = storage.getSync('non-existent-key', 'default')
      expect(result).toBe('default')
    })

    it('should handle storage errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(uni.setStorageSync as jest.Mock).mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const result = storage.setSync('test-key', 'test-value')
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle JSON parse errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(uni.getStorageSync as jest.Mock).mockReturnValue('invalid-json')

      const result = storage.getSync('test-key', 'default')
      expect(result).toBe('default')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('set and get (async)', () => {
    it('should store and retrieve data asynchronously', async () => {
      const testData = { name: 'test', value: 123 }
      const key = 'test-key'

      // 模拟异步存储
      ;(uni.setStorage as jest.Mock).mockResolvedValue({ errMsg: 'setStorage:ok' })
      ;(uni.getStorage as jest.Mock).mockResolvedValue({ 
        data: JSON.stringify({ value: testData })
      })

      // 存储数据
      const setResult = await storage.set(key, testData)
      expect(setResult).toBe(true)

      // 获取数据
      const retrieved = await storage.get(key)
      expect(retrieved).toEqual(testData)
    })

    it('should handle async storage errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(uni.setStorage as jest.Mock).mockRejectedValue(new Error('Network error'))

      const result = await storage.set('test-key', 'test-value')
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('removeSync and remove', () => {
    it('should remove data synchronously', () => {
      const result = storage.removeSync('test-key')
      expect(result).toBe(true)
      expect(uni.removeStorageSync).toHaveBeenCalledWith('test-key')
    })

    it('should remove data asynchronously', async () => {
      ;(uni.removeStorage as jest.Mock).mockResolvedValue({ errMsg: 'removeStorage:ok' })

      const result = await storage.remove('test-key')
      expect(result).toBe(true)
      expect(uni.removeStorage).toHaveBeenCalledWith({ key: 'test-key' })
    })
  })

  describe('clearSync and clear', () => {
    it('should clear all data synchronously', () => {
      const result = storage.clearSync()
      expect(result).toBe(true)
      expect(uni.clearStorageSync).toHaveBeenCalled()
    })

    it('should clear all data asynchronously', async () => {
      ;(uni.clearStorage as jest.Mock).mockResolvedValue({ errMsg: 'clearStorage:ok' })

      const result = await storage.clear()
      expect(result).toBe(true)
      expect(uni.clearStorage).toHaveBeenCalled()
    })
  })

  describe('has', () => {
    it('should check if key exists', () => {
      ;(uni.getStorageSync as jest.Mock).mockReturnValue('some-value')
      expect(storage.has('test-key')).toBe(true)

      ;(uni.getStorageSync as jest.Mock).mockReturnValue('')
      expect(storage.has('non-existent-key')).toBe(false)
    })

    it('should handle errors when checking existence', () => {
      ;(uni.getStorageSync as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(storage.has('test-key')).toBe(false)
    })
  })

  describe('getInfo', () => {
    it('should get storage info', () => {
      const mockInfo = {
        keys: ['key1', 'key2'],
        currentSize: 100,
        limitSize: 10240
      }
      ;(uni.getStorageInfoSync as jest.Mock).mockReturnValue(mockInfo)

      const info = storage.getInfo()
      expect(info).toEqual(mockInfo)
    })

    it('should handle info errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(uni.getStorageInfoSync as jest.Mock).mockImplementation(() => {
        throw new Error('Info error')
      })

      const info = storage.getInfo()
      expect(info).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})

describe('STORAGE_KEYS', () => {
  it('should have all required storage keys', () => {
    expect(STORAGE_KEYS.TOKEN).toBe('user_token')
    expect(STORAGE_KEYS.USER_INFO).toBe('user_info')
    expect(STORAGE_KEYS.LANGUAGE).toBe('app_language')
    expect(STORAGE_KEYS.THEME).toBe('app_theme')
    expect(STORAGE_KEYS.SETTINGS).toBe('app_settings')
    expect(STORAGE_KEYS.TRADING_PAIRS).toBe('trading_pairs')
    expect(STORAGE_KEYS.FAVORITES).toBe('user_favorites')
    expect(STORAGE_KEYS.RECENT_SEARCH).toBe('recent_search')
  })

  it('should be readonly', () => {
    expect(() => {
      // @ts-ignore - 测试只读属性
      STORAGE_KEYS.TOKEN = 'modified'
    }).toThrow()
  })
})
