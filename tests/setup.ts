/**
 * 测试环境配置文件
 */

// 模拟uni-app全局对象
global.uni = {
  // 存储相关
  getStorageSync: jest.fn(() => ''),
  setStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  clearStorageSync: jest.fn(),
  getStorage: jest.fn(() => Promise.resolve({ data: '' })),
  setStorage: jest.fn(() => Promise.resolve()),
  removeStorage: jest.fn(() => Promise.resolve()),
  
  // 网络请求
  request: jest.fn(() => Promise.resolve({ 
    data: { code: 0, data: {}, message: 'success' },
    statusCode: 200 
  })),
  
  // 导航相关
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),
  reLaunch: jest.fn(),
  switchTab: jest.fn(),
  navigateBack: jest.fn(),
  
  // 系统信息
  getSystemInfoSync: jest.fn(() => ({
    platform: 'h5',
    system: 'iOS 14.0',
    version: '1.0.0',
    screenWidth: 375,
    screenHeight: 812,
    statusBarHeight: 44,
    safeAreaInsets: { top: 44, right: 0, bottom: 34, left: 0 }
  })),
  
  // 网络状态
  getNetworkType: jest.fn(() => Promise.resolve({ networkType: 'wifi' })),
  onNetworkStatusChange: jest.fn(),
  
  // UI交互
  showToast: jest.fn(),
  hideToast: jest.fn(),
  showModal: jest.fn(() => Promise.resolve({ confirm: true })),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  
  // 错误处理
  onError: jest.fn(),
  onUnhandledRejection: jest.fn(),
  
  // 文件上传
  uploadFile: jest.fn(() => Promise.resolve({
    data: JSON.stringify({ code: 0, data: { url: 'test.jpg' } }),
    statusCode: 200
  }))
}

// 模拟console方法（避免测试输出过多日志）
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
}

// 模拟fetch（用于图标加载等）
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('<svg></svg>'),
    json: () => Promise.resolve({})
  } as Response)
)

// 模拟定时器
jest.useFakeTimers()

// 测试工具函数
export const mockUniResponse = (data: any, code = 0, message = 'success') => {
  return {
    data: { code, data, message },
    statusCode: 200,
    header: {},
    cookies: []
  }
}

export const mockUniError = (message = 'Network Error', statusCode = 500) => {
  return Promise.reject({
    errMsg: message,
    statusCode,
    data: { code: statusCode, message }
  })
}

// 创建测试用的Vue组件挂载选项
export const createMountOptions = () => {
  return {
    global: {
      mocks: {
        $t: (key: string) => key,
        $tc: (key: string, count: number) => key,
        uni
      }
    }
  }
}

// 等待异步操作完成
export const waitFor = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 清理测试环境
afterEach(() => {
  jest.clearAllMocks()
  jest.clearAllTimers()
})
