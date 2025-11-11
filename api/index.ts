/**
 * API 统一管理入口
 * 提供完整的API服务、错误处理、重试机制
 */

import request from '@/utils/request'
import { AuthAPI } from './modules/auth'
import { marketApi } from './modules/market'
import { tradeApi } from './modules/trade'
import { userApi } from './modules/user'

// 导出所有API模块
export { AuthAPI as authApi, marketApi, tradeApi, userApi }

// 公告API模块
export const announcementApi = {
  /**
   * 获取公告列表
   */
  getList: (params?: {
    page?: number
    pageSize?: number
    type?: string
    language?: string
  }) => {
    return request<{
      list: Array<{
        id: string
        title: string
        content: string
        type: 'system' | 'maintenance' | 'feature' | 'security'
        priority: 'low' | 'medium' | 'high'
        publishTime: number
        isTop: boolean
        readCount: number
        language: string
      }>
      total: number
      hasMore: boolean
    }>({
      url: '/api/announcements',
      method: 'GET',
      data: params
    })
  },

  /**
   * 获取公告详情
   */
  getDetail: (id: string) => {
    return request<{
      id: string
      title: string
      content: string
      type: string
      priority: string
      publishTime: number
      updateTime?: number
      readCount: number
      language: string
      attachments?: Array<{
        name: string
        url: string
        size: number
        type: string
      }>
    }>({
      url: `/api/announcements/${id}`,
      method: 'GET'
    })
  },

  /**
   * 标记公告为已读
   */
  markAsRead: (id: string) => {
    return request<{}>({
      url: `/api/announcements/${id}/read`,
      method: 'POST'
    })
  }
}

// 通知API模块
export const notificationApi = {
  /**
   * 获取通知列表
   */
  getList: (params?: {
    page?: number
    pageSize?: number
    type?: 'order' | 'deposit' | 'withdraw' | 'security' | 'system' | 'price_alert'
    isRead?: boolean
  }) => {
    return request<{
      list: Array<{
        id: string
        type: string
        title: string
        content: string
        data?: any
        isRead: boolean
        createTime: number
      }>
      total: number
      unreadCount: number
    }>({
      url: '/api/notifications',
      method: 'GET', 
      data: params
    })
  },

  /**
   * 标记通知为已读
   */
  markAsRead: (id: string) => {
    return request<{}>({
      url: `/api/notifications/${id}/read`,
      method: 'PUT'
    })
  },

  /**
   * 标记所有通知为已读
   */
  markAllAsRead: () => {
    return request<{}>({
      url: '/api/notifications/read-all',
      method: 'PUT'
    })
  },

  /**
   * 删除通知
   */
  delete: (id: string) => {
    return request<{}>({
      url: `/api/notifications/${id}`,
      method: 'DELETE'
    })
  },

  /**
   * 清空所有通知
   */
  clear: () => {
    return request<{}>({
      url: '/api/notifications',
      method: 'DELETE'
    })
  },

  /**
   * 获取未读通知数量
   */
  getUnreadCount: () => {
    return request<{ count: number }>({
      url: '/api/notifications/unread-count',
      method: 'GET'
    })
  }
}

// 系统配置API
export const systemApi = {
  /**
   * 获取系统配置
   */
  getConfig: () => {
    return request<{
      appName: string
      version: string
      minAppVersion: string
      maintainMode: boolean
      supportedLanguages: string[]
      supportedCurrencies: string[]
      tradingPairs: Array<{
        symbol: string
        baseAsset: string
        quoteAsset: string
        status: 'TRADING' | 'HALT' | 'BREAK'
        minQty: string
        maxQty: string
        stepSize: string
        tickSize: string
        minNotional: string
      }>
      fees: {
        trading: {
          maker: string
          taker: string
        }
        withdrawal: Record<string, string>
      }
    }>({
      url: '/api/system/config',
      method: 'GET'
    })
  },

  /**
   * 获取系统状态
   */
  getStatus: () => {
    return request<{
      status: 'normal' | 'maintenance' | 'degraded'
      serverTime: number
      timezone: string
      services: Array<{
        name: string
        status: 'online' | 'offline' | 'degraded'
        responseTime: number
      }>
    }>({
      url: '/api/system/status',
      method: 'GET'
    })
  },

  /**
   * 上传文件
   */
  uploadFile: (file: File | any, type: 'avatar' | 'kyc' | 'other' = 'other') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    return request<{
      url: string
      filename: string
      size: number
      type: string
    }>({
      url: '/api/system/upload',
      method: 'POST',
      data: formData,
      header: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 价格预警API
export const alertApi = {
  /**
   * 创建价格预警
   */
  create: (data: {
    symbol: string
    type: 'price_above' | 'price_below' | 'price_change'
    value: string
    isEnabled: boolean
  }) => {
    return request<{ id: string }>({
      url: '/api/alerts',
      method: 'POST',
      data
    })
  },

  /**
   * 获取预警列表
   */
  getList: (params?: {
    page?: number
    pageSize?: number
    symbol?: string
    isEnabled?: boolean
  }) => {
    return request<{
      list: Array<{
        id: string
        symbol: string
        type: string
        value: string
        isEnabled: boolean
        isTriggered: boolean
        triggerTime?: number
        createTime: number
      }>
      total: number
    }>({
      url: '/api/alerts',
      method: 'GET',
      data: params
    })
  },

  /**
   * 更新预警
   */
  update: (id: string, data: {
    type?: string
    value?: string
    isEnabled?: boolean
  }) => {
    return request<{}>({
      url: `/api/alerts/${id}`,
      method: 'PUT',
      data
    })
  },

  /**
   * 删除预警
   */
  delete: (id: string) => {
    return request<{}>({
      url: `/api/alerts/${id}`,
      method: 'DELETE'
    })
  }
}

// API错误处理工具
export const apiUtils = {
  /**
   * 处理API错误
   */
  handleError: (error: any) => {
    const errorMap: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权访问',
      403: '禁止访问',
      404: '请求资源不存在',
      422: '数据验证失败',
      429: '请求过于频繁',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    }
    
    const status = error.statusCode || error.status || 500
    const message = error.message || errorMap[status] || '网络请求失败'
    
    return {
      status,
      message,
      original: error
    }
  },

  /**
   * 重试请求
   */
  retryRequest: async <T>(
    requestFn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    try {
      return await requestFn()
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
        return apiUtils.retryRequest(requestFn, retries - 1, delay * 1.5)
      }
      throw error
    }
  },

  /**
   * 批量请求
   */
  batchRequest: async <T>(
    requests: Array<() => Promise<T>>
  ): Promise<Array<T | Error>> => {
    return Promise.allSettled(
      requests.map(req => req())
    ).then(results => 
      results.map(result => 
        result.status === 'fulfilled' ? result.value : result.reason
      )
    )
  },

  /**
   * 轮询请求
   */
  pollRequest: async <T>(
    requestFn: () => Promise<T>,
    condition: (data: T) => boolean,
    interval: number = 2000,
    maxAttempts: number = 30
  ): Promise<T> => {
    let attempts = 0
    
    const poll = async (): Promise<T> => {
      attempts++
      const data = await requestFn()
      
      if (condition(data) || attempts >= maxAttempts) {
        return data
      }
      
      await new Promise(resolve => setTimeout(resolve, interval))
      return poll()
    }
    
    return poll()
  }
}

// 导出默认API实例
export default {
  auth: AuthAPI,
  market: marketApi,
  trade: tradeApi,
  user: userApi,
  announcement: announcementApi,
  notification: notificationApi,
  system: systemApi,
  alert: alertApi,
  utils: apiUtils
}
