import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { systemApi } from '@/api'

export interface TradingPairConfig {
  symbol: string
  baseAsset: string
  quoteAsset: string
  status: 'TRADING' | 'HALT' | 'BREAK'
  minQty: string
  maxQty: string
  stepSize: string
  tickSize: string
  minNotional: string
}

export interface SystemConfig {
  appName: string
  version: string
  minAppVersion: string
  maintainMode: boolean
  supportedLanguages: string[]
  supportedCurrencies: string[]
  tradingPairs: TradingPairConfig[]
  fees: {
    trading: {
      maker: string
      taker: string
    }
    withdrawal: Record<string, string>
  }
}

export interface SystemStatus {
  status: 'normal' | 'maintenance' | 'degraded'
  serverTime: number
  timezone: string
  services: Array<{
    name: string
    status: 'online' | 'offline' | 'degraded'
    responseTime: number
  }>
}

export const useSystemStore = defineStore('system', () => {
  // 状态
  const config = ref<SystemConfig | null>(null)
  const status = ref<SystemStatus | null>(null)
  const serverTime = ref<number>(Date.now())
  const timeOffset = ref<number>(0)
  const loading = ref(false)

  // 计算属性
  const isMaintenanceMode = computed(() => {
    return config.value?.maintainMode || false
  })

  const isSystemNormal = computed(() => {
    return status.value?.status === 'normal'
  })

  const activeTradingPairs = computed(() => {
    return config.value?.tradingPairs.filter(pair => pair.status === 'TRADING') || []
  })

  const supportedAssets = computed(() => {
    const assets = new Set<string>()
    config.value?.tradingPairs.forEach(pair => {
      assets.add(pair.baseAsset)
      assets.add(pair.quoteAsset)
    })
    return Array.from(assets)
  })

  const currentServerTime = computed(() => {
    return serverTime.value + timeOffset.value
  })

  // 方法
  const fetchConfig = async () => {
    loading.value = true
    try {
      const response = await systemApi.getConfig()
      config.value = response.data
      
      // 更新本地版本检查
      checkAppVersion()
    } catch (error) {
      console.error('获取系统配置失败:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchStatus = async () => {
    try {
      const response = await systemApi.getStatus()
      status.value = response.data
      
      // 同步服务器时间
      updateServerTime(response.data.serverTime)
    } catch (error) {
      console.error('获取系统状态失败:', error)
    }
  }

  const updateServerTime = (serverTimestamp: number) => {
    const localTime = Date.now()
    timeOffset.value = serverTimestamp - localTime
    serverTime.value = localTime
  }

  const syncTime = () => {
    // 定期同步服务器时间
    fetchStatus()
  }

  const checkAppVersion = () => {
    if (!config.value) return
    
    const currentVersion = config.value.version
    const minVersion = config.value.minAppVersion
    
    // TODO: 实现版本比较逻辑
    // 如果当前版本低于最小版本，提示更新
  }

  const getTradingPairConfig = (symbol: string): TradingPairConfig | null => {
    return config.value?.tradingPairs.find(pair => pair.symbol === symbol) || null
  }

  const getWithdrawalFee = (asset: string): string => {
    return config.value?.fees.withdrawal[asset] || '0'
  }

  const getTradingFees = () => {
    return config.value?.fees.trading || { maker: '0.001', taker: '0.001' }
  }

  const isAssetSupported = (asset: string): boolean => {
    return supportedAssets.value.includes(asset)
  }

  const isTradingPairActive = (symbol: string): boolean => {
    const pair = getTradingPairConfig(symbol)
    return pair?.status === 'TRADING'
  }

  const formatNumber = (value: string | number, pair: TradingPairConfig): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    const decimals = pair.tickSize.split('.')[1]?.length || 8
    return num.toFixed(decimals)
  }

  const validateOrderQuantity = (symbol: string, quantity: string): boolean => {
    const pair = getTradingPairConfig(symbol)
    if (!pair) return false
    
    const qty = parseFloat(quantity)
    const minQty = parseFloat(pair.minQty)
    const maxQty = parseFloat(pair.maxQty)
    const stepSize = parseFloat(pair.stepSize)
    
    if (qty < minQty || qty > maxQty) return false
    
    // 检查步长
    const remainder = (qty - minQty) % stepSize
    return Math.abs(remainder) < 1e-8
  }

  const validateOrderPrice = (symbol: string, price: string): boolean => {
    const pair = getTradingPairConfig(symbol)
    if (!pair) return false
    
    const tickSize = parseFloat(pair.tickSize)
    const priceNum = parseFloat(price)
    
    // 检查价格精度
    const remainder = priceNum % tickSize
    return Math.abs(remainder) < 1e-8
  }

  const validateMinNotional = (symbol: string, quantity: string, price: string): boolean => {
    const pair = getTradingPairConfig(symbol)
    if (!pair) return false
    
    const notional = parseFloat(quantity) * parseFloat(price)
    const minNotional = parseFloat(pair.minNotional)
    
    return notional >= minNotional
  }

  // 初始化
  const init = async () => {
    await Promise.all([
      fetchConfig(),
      fetchStatus()
    ])
    
    // 开启定时同步
    setInterval(syncTime, 30000) // 每30秒同步一次时间
  }

  return {
    // 状态
    config,
    status,
    serverTime,
    timeOffset,
    loading,
    
    // 计算属性
    isMaintenanceMode,
    isSystemNormal,
    activeTradingPairs,
    supportedAssets,
    currentServerTime,
    
    // 方法
    fetchConfig,
    fetchStatus,
    updateServerTime,
    syncTime,
    checkAppVersion,
    getTradingPairConfig,
    getWithdrawalFee,
    getTradingFees,
    isAssetSupported,
    isTradingPairActive,
    formatNumber,
    validateOrderQuantity,
    validateOrderPrice,
    validateMinNotional,
    init
  }
}, {
  persist: {
    key: 'system-store',
    paths: ['config']
  }
})

export default useSystemStore
