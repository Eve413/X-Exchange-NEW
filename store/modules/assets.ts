import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api'

export interface AssetBalance {
  asset: string
  free: string
  locked: string
  freeze: string
  withdrawing: string
  btcValue: string
  usdtValue: string
}

export interface DepositRecord {
  id: string
  amount: string
  asset: string
  address: string
  addressTag?: string
  txId: string
  insertTime: number
  network: string
  status: number
  confirmTimes: string
}

export interface WithdrawRecord {
  id: string
  amount: string
  transactionFee: string
  asset: string
  address: string
  addressTag?: string
  txId: string
  applyTime: number
  network: string
  status: number
}

export interface TransferRecord {
  asset: string
  amount: string
  type: string
  status: string
  tranId: number
  timestamp: number
}

export const useAssetsStore = defineStore('assets', () => {
  // 状态
  const balances = ref<AssetBalance[]>([])
  const depositHistory = ref<DepositRecord[]>([])
  const withdrawHistory = ref<WithdrawRecord[]>([])
  const transferHistory = ref<TransferRecord[]>([])
  const loading = ref(false)
  const refreshing = ref(false)

  // 计算属性
  const totalBtcValue = computed(() => {
    return balances.value.reduce((total, balance) => {
      return total + parseFloat(balance.btcValue || '0')
    }, 0)
  })

  const totalUsdtValue = computed(() => {
    return balances.value.reduce((total, balance) => {
      return total + parseFloat(balance.usdtValue || '0')
    }, 0)
  })

  const nonZeroBalances = computed(() => {
    return balances.value.filter(balance => {
      const total = parseFloat(balance.free) + parseFloat(balance.locked)
      return total > 0
    })
  })

  const getBalance = computed(() => (asset: string) => {
    return balances.value.find(b => b.asset === asset) || {
      asset,
      free: '0',
      locked: '0',
      freeze: '0',
      withdrawing: '0',
      btcValue: '0',
      usdtValue: '0'
    }
  })

  const getAvailableBalance = computed(() => (asset: string) => {
    const balance = getBalance.value(asset)
    return parseFloat(balance.free)
  })

  const getTotalBalance = computed(() => (asset: string) => {
    const balance = getBalance.value(asset)
    return parseFloat(balance.free) + parseFloat(balance.locked)
  })

  // 方法
  const fetchBalances = async () => {
    loading.value = true
    try {
      const response = await userApi.getAssets()
      balances.value = response.data
    } catch (error) {
      console.error('获取资产余额失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const refreshBalances = async () => {
    refreshing.value = true
    try {
      await fetchBalances()
    } finally {
      refreshing.value = false
    }
  }

  const fetchDepositHistory = async (params?: {
    asset?: string
    status?: number
    startTime?: number
    endTime?: number
    offset?: number
    limit?: number
  }) => {
    try {
      const response = await userApi.getDepositHistory(params)
      
      if (params?.offset && params.offset > 0) {
        // 分页加载
        depositHistory.value.push(...response.data.list)
      } else {
        // 首次加载
        depositHistory.value = response.data.list
      }
      
      return {
        list: response.data.list,
        total: response.data.total,
        hasMore: depositHistory.value.length < response.data.total
      }
    } catch (error) {
      console.error('获取充值历史失败:', error)
      throw error
    }
  }

  const fetchWithdrawHistory = async (params?: {
    asset?: string
    withdrawOrderId?: string
    status?: number
    startTime?: number
    endTime?: number
    offset?: number
    limit?: number
  }) => {
    try {
      const response = await userApi.getWithdrawHistory(params)
      
      if (params?.offset && params.offset > 0) {
        // 分页加载
        withdrawHistory.value.push(...response.data.list)
      } else {
        // 首次加载
        withdrawHistory.value = response.data.list
      }
      
      return {
        list: response.data.list,
        total: response.data.total,
        hasMore: withdrawHistory.value.length < response.data.total
      }
    } catch (error) {
      console.error('获取提现历史失败:', error)
      throw error
    }
  }

  const fetchTransferHistory = async (params?: {
    type: string
    startTime?: number
    endTime?: number
    current?: number
    size?: number
  }) => {
    try {
      const response = await userApi.getTransferHistory(params)
      
      if (params?.current && params.current > 1) {
        // 分页加载
        transferHistory.value.push(...response.data.rows)
      } else {
        // 首次加载
        transferHistory.value = response.data.rows
      }
      
      return {
        list: response.data.rows,
        total: response.data.total,
        hasMore: transferHistory.value.length < response.data.total
      }
    } catch (error) {
      console.error('获取划转历史失败:', error)
      throw error
    }
  }

  const getDepositAddress = async (asset: string, network?: string) => {
    try {
      const response = await userApi.getDepositAddress(asset, network)
      return response.data
    } catch (error) {
      console.error('获取充值地址失败:', error)
      throw error
    }
  }

  const withdraw = async (params: {
    asset: string
    address: string
    amount: string
    network?: string
    addressTag?: string
    name?: string
  }) => {
    try {
      const response = await userApi.withdraw(params)
      
      // 刷新余额
      await refreshBalances()
      
      return response.data
    } catch (error) {
      console.error('提现失败:', error)
      throw error
    }
  }

  const transfer = async (params: {
    asset: string
    amount: string
    fromAccountType: 'SPOT' | 'FUTURES' | 'MARGIN'
    toAccountType: 'SPOT' | 'FUTURES' | 'MARGIN'
  }) => {
    try {
      const response = await userApi.transfer(params)
      
      // 刷新余额
      await refreshBalances()
      
      return response.data
    } catch (error) {
      console.error('资产划转失败:', error)
      throw error
    }
  }

  const updateBalance = (asset: string, updates: Partial<AssetBalance>) => {
    const index = balances.value.findIndex(b => b.asset === asset)
    if (index !== -1) {
      balances.value[index] = { ...balances.value[index], ...updates }
    } else {
      // 如果不存在，创建新的余额记录
      balances.value.push({
        asset,
        free: '0',
        locked: '0',
        freeze: '0',
        withdrawing: '0',
        btcValue: '0',
        usdtValue: '0',
        ...updates
      })
    }
  }

  const addDepositRecord = (record: DepositRecord) => {
    // WebSocket或推送接收到新的充值记录
    const existingIndex = depositHistory.value.findIndex(r => r.id === record.id)
    if (existingIndex !== -1) {
      depositHistory.value[existingIndex] = record
    } else {
      depositHistory.value.unshift(record)
    }
  }

  const addWithdrawRecord = (record: WithdrawRecord) => {
    // WebSocket或推送接收到新的提现记录
    const existingIndex = withdrawHistory.value.findIndex(r => r.id === record.id)
    if (existingIndex !== -1) {
      withdrawHistory.value[existingIndex] = record
    } else {
      withdrawHistory.value.unshift(record)
    }
  }

  const getDepositStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
      0: '待确认',
      1: '成功',
      2: '异常',
      3: '错误'
    }
    return statusMap[status] || '未知状态'
  }

  const getWithdrawStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
      0: '邮件确认',
      1: '已取消',
      2: '等待审核',
      3: '已拒绝',
      4: '处理中',
      5: '失败',
      6: '已完成'
    }
    return statusMap[status] || '未知状态'
  }

  // 清理数据
  const clearHistory = () => {
    depositHistory.value = []
    withdrawHistory.value = []
    transferHistory.value = []
  }

  return {
    // 状态
    balances,
    depositHistory,
    withdrawHistory,
    transferHistory,
    loading,
    refreshing,
    
    // 计算属性
    totalBtcValue,
    totalUsdtValue,
    nonZeroBalances,
    getBalance,
    getAvailableBalance,
    getTotalBalance,
    
    // 方法
    fetchBalances,
    refreshBalances,
    fetchDepositHistory,
    fetchWithdrawHistory,
    fetchTransferHistory,
    getDepositAddress,
    withdraw,
    transfer,
    updateBalance,
    addDepositRecord,
    addWithdrawRecord,
    getDepositStatusText,
    getWithdrawStatusText,
    clearHistory
  }
}, {
  persist: {
    key: 'assets-store',
    paths: ['balances']
  }
})

export default useAssetsStore
