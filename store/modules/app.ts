import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface SystemInfo {
  platform: string
  system: string
  version: string
  screenWidth: number
  screenHeight: number
  statusBarHeight: number
  safeAreaInsets: any
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: string
  currency: string
  priceAlert: boolean
  pushNotification: boolean
}

export const useAppStore = defineStore('app', () => {
  // 状态定义
  const isLoading = ref(false)
  const systemInfo = ref<SystemInfo | null>(null)
  const networkType = ref<string>('unknown')
  const isOnline = ref(true)
  const settings = ref<AppSettings>({
    theme: 'light',
    language: 'zh-CN',
    currency: 'CNY',
    priceAlert: true,
    pushNotification: true
  })
  
  // Toast相关状态
  const toastVisible = ref(false)
  const toastMessage = ref('')
  const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')

  // 计算属性
  const isDarkTheme = computed(() => {
    if (settings.value.theme === 'auto') {
      // 根据系统主题判断
      return systemInfo.value?.system?.includes('Dark') || false
    }
    return settings.value.theme === 'dark'
  })

  const isWeixin = computed(() => {
    return systemInfo.value?.platform === 'mp-weixin'
  })

  const isH5 = computed(() => {
    return systemInfo.value?.platform === 'h5'
  })

  const isApp = computed(() => {
    return systemInfo.value?.platform === 'app'
  })

  // 操作方法
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setSystemInfo = (info: SystemInfo) => {
    systemInfo.value = info
  }

  const setNetworkType = (type: string) => {
    networkType.value = type
    isOnline.value = type !== 'none'
  }

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  const setTheme = (theme: AppSettings['theme']) => {
    settings.value.theme = theme
  }

  const setLanguage = (language: string) => {
    settings.value.language = language
  }

  const setCurrency = (currency: string) => {
    settings.value.currency = currency
  }

  // Toast相关方法
  const showToast = (
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) => {
    toastMessage.value = message
    toastType.value = type
    toastVisible.value = true
    
    // 自动隐藏
    setTimeout(() => {
      hideToast()
    }, duration)
  }

  const hideToast = () => {
    toastVisible.value = false
    toastMessage.value = ''
  }

  // 初始化用户信息
  const initUserInfo = async () => {
    try {
      // 这里可以从后端获取用户配置
      console.log('初始化用户信息')
    } catch (error) {
      console.error('初始化用户信息失败:', error)
    }
  }

  // 获取状态栏高度（用于适配）
  const getStatusBarHeight = (): number => {
    return systemInfo.value?.statusBarHeight || 0
  }

  // 获取安全区域
  const getSafeAreaInsets = () => {
    return systemInfo.value?.safeAreaInsets || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }

  return {
    // 状态
    isLoading,
    systemInfo,
    networkType,
    isOnline,
    settings,
    toastVisible,
    toastMessage,
    toastType,
    
    // 计算属性
    isDarkTheme,
    isWeixin,
    isH5,
    isApp,
    
    // 方法
    setLoading,
    setSystemInfo,
    setNetworkType,
    updateSettings,
    setTheme,
    setLanguage,
    setCurrency,
    showToast,
    hideToast,
    initUserInfo,
    getStatusBarHeight,
    getSafeAreaInsets
  }
}, {
  persist: {
    key: 'app-store',
    paths: ['settings']
  }
})

export default useAppStore 