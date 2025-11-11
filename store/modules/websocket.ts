import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WebSocketManager } from '@/utils/websocket'

export interface WSSubscription {
  id: string
  channel: string
  symbol?: string
  interval?: string
  callback: (data: any) => void
  active: boolean
}

export const useWebSocketStore = defineStore('websocket', () => {
  // 状态
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const reconnectAttempts = ref(0)
  const subscriptions = ref<Map<string, WSSubscription>>(new Map())
  const wsManager = ref<WebSocketManager | null>(null)

  // 计算属性
  const activeSubscriptions = computed(() => {
    return Array.from(subscriptions.value.values()).filter(sub => sub.active)
  })

  const subscriptionCount = computed(() => {
    return activeSubscriptions.value.length
  })

  const connectionStatus = computed(() => {
    if (isConnecting.value) return 'connecting'
    if (isConnected.value) return 'connected'
    return 'disconnected'
  })

  // 方法
  const connect = async (url?: string) => {
    if (isConnected.value || isConnecting.value) return

    isConnecting.value = true
    
    try {
      wsManager.value = new WebSocketManager({
        url: url || 'wss://stream.x-exchange.com/ws',
        onOpen: () => {
          isConnected.value = true
          isConnecting.value = false
          reconnectAttempts.value = 0
          console.log('WebSocket 连接成功')
          
          // 重新订阅之前的频道
          resubscribeAll()
        },
        onClose: () => {
          isConnected.value = false
          isConnecting.value = false
          console.log('WebSocket 连接断开')
        },
        onError: (error) => {
          console.error('WebSocket 错误:', error)
          isConnecting.value = false
        },
        onMessage: handleMessage,
        onReconnect: (attempts) => {
          reconnectAttempts.value = attempts
          console.log(`WebSocket 重连第 ${attempts} 次`)
        }
      })
      
      await wsManager.value.connect()
    } catch (error) {
      console.error('WebSocket 连接失败:', error)
      isConnecting.value = false
    }
  }

  const disconnect = () => {
    if (wsManager.value) {
      wsManager.value.disconnect()
      wsManager.value = null
    }
    
    isConnected.value = false
    isConnecting.value = false
    subscriptions.value.clear()
  }

  const subscribe = (params: {
    channel: string
    symbol?: string
    interval?: string
    callback: (data: any) => void
  }): string => {
    const id = generateSubscriptionId(params)
    
    const subscription: WSSubscription = {
      id,
      channel: params.channel,
      symbol: params.symbol,
      interval: params.interval,
      callback: params.callback,
      active: false
    }
    
    subscriptions.value.set(id, subscription)
    
    if (isConnected.value) {
      sendSubscribe(subscription)
    }
    
    return id
  }

  const unsubscribe = (subscriptionId: string) => {
    const subscription = subscriptions.value.get(subscriptionId)
    if (!subscription) return
    
    if (isConnected.value) {
      sendUnsubscribe(subscription)
    }
    
    subscriptions.value.delete(subscriptionId)
  }

  const sendSubscribe = (subscription: WSSubscription) => {
    if (!wsManager.value || !isConnected.value) return
    
    const message = {
      method: 'SUBSCRIBE',
      params: buildParams(subscription),
      id: subscription.id
    }
    
    wsManager.value.send(message)
    subscription.active = true
  }

  const sendUnsubscribe = (subscription: WSSubscription) => {
    if (!wsManager.value || !isConnected.value) return
    
    const message = {
      method: 'UNSUBSCRIBE',
      params: buildParams(subscription),
      id: subscription.id
    }
    
    wsManager.value.send(message)
    subscription.active = false
  }

  const buildParams = (subscription: WSSubscription): string[] => {
    const params: string[] = []
    
    switch (subscription.channel) {
      case 'ticker':
        if (subscription.symbol) {
          params.push(`${subscription.symbol.toLowerCase()}@ticker`)
        } else {
          params.push('!ticker@arr')
        }
        break
        
      case 'kline':
        if (subscription.symbol && subscription.interval) {
          params.push(`${subscription.symbol.toLowerCase()}@kline_${subscription.interval}`)
        }
        break
        
      case 'depth':
        if (subscription.symbol) {
          params.push(`${subscription.symbol.toLowerCase()}@depth`)
        }
        break
        
      case 'trade':
        if (subscription.symbol) {
          params.push(`${subscription.symbol.toLowerCase()}@trade`)
        }
        break
        
      case 'aggTrade':
        if (subscription.symbol) {
          params.push(`${subscription.symbol.toLowerCase()}@aggTrade`)
        }
        break
        
      case 'userStream':
        // 用户数据流需要单独处理
        params.push('userStream')
        break
        
      default:
        console.warn(`未知的订阅频道: ${subscription.channel}`)
    }
    
    return params
  }

  const generateSubscriptionId = (params: {
    channel: string
    symbol?: string
    interval?: string
  }): string => {
    const parts = [params.channel]
    if (params.symbol) parts.push(params.symbol.toLowerCase())
    if (params.interval) parts.push(params.interval)
    return parts.join(':')
  }

  const handleMessage = (data: any) => {
    try {
      const message = typeof data === 'string' ? JSON.parse(data) : data
      
      // 处理订阅确认
      if (message.result === null && message.id) {
        const subscription = subscriptions.value.get(message.id)
        if (subscription) {
          subscription.active = true
          console.log(`订阅成功: ${subscription.channel}`)
        }
        return
      }
      
      // 处理数据流
      if (message.stream && message.data) {
        const streamName = message.stream
        const streamData = message.data
        
        // 找到匹配的订阅
        for (const subscription of subscriptions.value.values()) {
          if (isStreamMatch(streamName, subscription)) {
            subscription.callback(streamData)
          }
        }
      }
    } catch (error) {
      console.error('处理 WebSocket 消息失败:', error)
    }
  }

  const isStreamMatch = (streamName: string, subscription: WSSubscription): boolean => {
    const stream = streamName.toLowerCase()
    
    switch (subscription.channel) {
      case 'ticker':
        return stream.includes('@ticker')
        
      case 'kline':
        return stream.includes('@kline') && 
               (!subscription.symbol || stream.startsWith(subscription.symbol.toLowerCase())) &&
               (!subscription.interval || stream.includes(subscription.interval))
        
      case 'depth':
        return stream.includes('@depth') &&
               (!subscription.symbol || stream.startsWith(subscription.symbol.toLowerCase()))
        
      case 'trade':
        return stream.includes('@trade') &&
               (!subscription.symbol || stream.startsWith(subscription.symbol.toLowerCase()))
        
      case 'aggTrade':
        return stream.includes('@aggTrade') &&
               (!subscription.symbol || stream.startsWith(subscription.symbol.toLowerCase()))
        
      default:
        return false
    }
  }

  const resubscribeAll = () => {
    // 重新订阅所有活跃的订阅
    for (const subscription of subscriptions.value.values()) {
      if (subscription.active) {
        subscription.active = false // 重置状态
        sendSubscribe(subscription)
      }
    }
  }

  // 便捷订阅方法
  const subscribeTicker = (symbol?: string, callback?: (data: any) => void) => {
    return subscribe({
      channel: 'ticker',
      symbol,
      callback: callback || (() => {})
    })
  }

  const subscribeKline = (symbol: string, interval: string, callback: (data: any) => void) => {
    return subscribe({
      channel: 'kline',
      symbol,
      interval,
      callback
    })
  }

  const subscribeDepth = (symbol: string, callback: (data: any) => void) => {
    return subscribe({
      channel: 'depth',
      symbol,
      callback
    })
  }

  const subscribeTrades = (symbol: string, callback: (data: any) => void) => {
    return subscribe({
      channel: 'trade',
      symbol,
      callback
    })
  }

  const subscribeUserStream = (callback: (data: any) => void) => {
    return subscribe({
      channel: 'userStream',
      callback
    })
  }

  // 清理资源
  const destroy = () => {
    disconnect()
    subscriptions.value.clear()
  }

  return {
    // 状态
    isConnected,
    isConnecting,
    reconnectAttempts,
    subscriptions,
    
    // 计算属性
    activeSubscriptions,
    subscriptionCount,
    connectionStatus,
    
    // 方法
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    subscribeTicker,
    subscribeKline,
    subscribeDepth,
    subscribeTrades,
    subscribeUserStream,
    destroy
  }
})

export default useWebSocketStore
