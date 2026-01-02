import { defineStore } from 'pinia'
import { tradingApi } from '@/api'
import { useUserStore } from './user'
import { SubscribeParam } from '@/api/modules/trading'
import { get } from 'http'
const userInfo = uni.getStorageSync('userData')
type PasKey = PasKey

export const useTradingStore = defineStore('trading', () => {
  const pasKeyAuth = "68de05da-f258-46a4-805d-f0e365ca98e3-android-api"
  const deviceAuth = "android"
  const appversionAuth = "1.0"

  const fetchTraderPerforma = async () => {
    try {
      const userStore = useUserStore()
      console.log("userInfo store trading.ts")
      console.log(userStore)
	  console.log("token" + userInfo.data.data.token)
      const userId = userInfo.data.data.id || 0
      const response = await tradingApi.traderPerforma(userId, {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.data.token || "",
        lang: "en"
      })
      // Return full response for consistent data structure
      return response.data
    } catch (error: any) {
      console.error('获取交易员表现失败:', error)
      return { 
        success: false, 
        message: error.message || '获取失败，请重试' 
      }
    }
  }

  const fetchTraderHistoryPerformance = async (day: number) => {
    try {
      const userStore = useUserStore()
      console.log("userInfo store trading.ts")
      console.log(userInfo.data.data.id)
      const userId = userInfo.data.data.id || 0
      const response = await tradingApi.traderPerformaByUserIdByDay(userId, day, {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.token || "",
        lang: "en"
      })
      // Return full response for consistent data structure
      return response.data
    } catch (error: any) {
      console.error('获取交易员表现失败:', error)
      return { 
        success: false, 
        message: error.message || '获取失败，请重试' 
      }
    }
  }

  const fetchTradingHistory = async (type: string, assetType: string) => {
    try {
      const userId = userInfo.data.data.id || 0
      const response = await tradingApi.tradeHistory(userId, type, assetType, {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.token || "",
        lang: "en"
      })
      return response.data
    } catch (error: any) {
      console.error('获取交易历史失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }

  const fetchTraderPerformaByUserId = async (expertID: number) => {
    try {
      const userStore = useUserStore()
      const userId = userInfo.data.data.id || 0
      const response = await tradingApi.traderPerformaByUserId(expertID,userId, {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.token || "",
        lang: "en"
      })
      // Return full response for consistent data structure
      return response.data
    } catch (error: any) {
      console.error('获取交易员表现失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }

  const subscribeToTrader = async (amount: number, expertId: number, copyTrading: boolean) => {
     // Ensure userId is a number at runtime (type assertions don't convert values)
     const rawId = userInfo?.data?.data?.id
     const userId: number = typeof rawId === 'number' ? rawId : Number(rawId) || 0
    try {
      const response = await tradingApi.subscribeToTrader( {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.token || "",
        lang: "en",
        expertId: Number(expertId),
        userId: userId,
        amount: Number(amount),
        copyAllTrade: !!copyTrading,
        status: true
      })
      return response.data
    } catch (error: any) {
      console.error('订阅交易员失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }
  
  const unSubscribeCopyTrader = async (expertId: number) => {
     // Ensure userId is a number at runtime (type assertions don't convert values)
     const rawId = userInfo?.data?.data?.id
     const userId: number = typeof rawId === 'number' ? rawId : Number(rawId) || 0
    try {
      const response = await tradingApi.unSubscribeToTrader(expertId,userId, {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.token || "",
        lang: "en"
      })
      return response.data
    } catch (error: any) {
      console.error('订阅交易员失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }


  const getBanner = async () => {
    try {
      const response = await tradingApi.getBanner({
         passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
          lang: "en"
      })
      return response.data
    } catch (error: any) {
      console.error('获取Banner失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }

  const getCopyTradeSummary = async (expertId: number) => {
    try {
      const userId = userInfo.data.data.id || 0
      const response = await tradingApi.getCopyTradeSummary(expertId, userId, {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.token || "",
        lang: "en"
      })
      return response.data
    } catch (error: any) {
      console.error('获取跟单摘要失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }

  const getRecentOrders = async (expertId: number, limit: number) => {
    try {
      const response = await tradingApi.getRecentOrders(expertId, limit, {
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        token: userInfo.data.token || "",
        lang: "en"
      })
      return response.data
    } catch (error: any) {
      console.error('获取最新订单失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }

  const getAirdrops = async (keyword?: string, status?: string) => {
    try {
      const response = await tradingApi.getAirdrops({
        passkey: pasKeyAuth,
        device: deviceAuth,
        appversion: appversionAuth,
        lang: "en",
        limit: 10,
        keyword: keyword ? keyword : '',
        status: status ? status : '',
        token: userInfo.data.token || "",
      })
      return response.data
    } catch (error: any) {
      console.error('获取空投失败:', error)
      return {
        success: false,
        message: error.message || '获取失败，请重试'
      }
    }
  }

  return {
    fetchTraderPerforma,
    fetchTraderPerformaByUserId,
    subscribeToTrader,
    getAirdrops,
    getBanner,
    getCopyTradeSummary,
    getRecentOrders,
    fetchTraderHistoryPerformance,
    fetchTradingHistory,
	  unSubscribeCopyTrader
  }
})

export default useTradingStore