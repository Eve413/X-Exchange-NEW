/**
 * WebSocket连接管理工具
 */

interface WebSocketConfig {
  url: string
  protocols?: string[]
  reconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  pingInterval?: number
  pongTimeout?: number
}

interface WebSocketMessage {
  id?: string
  method: string
  params?: any
  result?: any
  error?: any
}

export class WebSocketManager {
  private ws: any = null
  private config: WebSocketConfig
  private reconnectCount = 0
  private isConnecting = false
  private isDestroyed = false
  private pingTimer: any = null
  private pongTimer: any = null
  private subscriptions = new Map<string, Function[]>()
  private messageQueue: WebSocketMessage[] = []

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      pingInterval: 30000,
      pongTimeout: 10000,
      ...config
    }
  }

  /**
   * 连接WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === 1)) {
        resolve()
        return
      }

      this.isConnecting = true

      try {
        // #ifdef H5
        this.ws = new WebSocket(this.config.url, this.config.protocols)
        // #endif

        // #ifdef MP || APP-PLUS
        this.ws = uni.connectSocket({
          url: this.config.url,
          protocols: this.config.protocols,
          success: () => {
            console.log('WebSocket连接成功')
          },
          fail: (error: any) => {
            console.error('WebSocket连接失败:', error)
            reject(error)
          }
        })
        // #endif

        this.setupEventHandlers(resolve, reject)
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(resolve: Function, reject: Function) {
    // #ifdef H5
    this.ws.onopen = () => {
      this.onOpen(resolve)
    }

    this.ws.onmessage = (event: MessageEvent) => {
      this.onMessage(event.data)
    }

    this.ws.onclose = (event: CloseEvent) => {
      this.onClose(event.code, event.reason)
    }

    this.ws.onerror = (error: Event) => {
      this.onError(error, reject)
    }
    // #endif

    // #ifdef MP || APP-PLUS
    uni.onSocketOpen(() => {
      this.onOpen(resolve)
    })

    uni.onSocketMessage((res) => {
      this.onMessage(res.data)
    })

    uni.onSocketClose((res) => {
      this.onClose(res.code, res.reason)
    })

    uni.onSocketError((error) => {
      this.onError(error, reject)
    })
    // #endif
  }

  /**
   * 连接打开事件
   */
  private onOpen(resolve?: Function) {
    this.isConnecting = false
    this.reconnectCount = 0
    
    // 发送队列中的消息
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message) {
        this.send(message)
      }
    }

    // 开始心跳
    this.startPing()
    
    this.emit('open')
    resolve && resolve()
  }

  /**
   * 消息接收事件
   */
  private onMessage(data: string) {
    try {
      const message = JSON.parse(data)
      
      // 处理pong消息
      if (message.method === 'pong') {
        this.clearPongTimer()
        return
      }

      // 处理订阅消息
      if (message.method && this.subscriptions.has(message.method)) {
        const callbacks = this.subscriptions.get(message.method)!
        callbacks.forEach(callback => callback(message.params))
      }

      this.emit('message', message)
    } catch (error) {
      console.error('WebSocket消息解析错误:', error)
    }
  }

  /**
   * 连接关闭事件
   */
  private onClose(code: number, reason: string) {
    this.clearTimers()
    this.emit('close', { code, reason })

    // 自动重连
    if (this.config.reconnect && !this.isDestroyed && 
        this.reconnectCount < this.config.maxReconnectAttempts!) {
      this.reconnectCount++
      console.log(`WebSocket重连中... (${this.reconnectCount}/${this.config.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('WebSocket重连失败:', error)
        })
      }, this.config.reconnectInterval)
    }
  }

  /**
   * 连接错误事件
   */
  private onError(error: any, reject?: Function) {
    this.isConnecting = false
    console.error('WebSocket错误:', error)
    this.emit('error', error)
    reject && reject(error)
  }

  /**
   * 发送消息
   */
  send(message: WebSocketMessage): boolean {
    if (!this.ws || this.ws.readyState !== 1) {
      // 连接未建立时，将消息加入队列
      this.messageQueue.push(message)
      return false
    }

    try {
      const data = JSON.stringify(message)
      
      // #ifdef H5
      this.ws.send(data)
      // #endif

      // #ifdef MP || APP-PLUS
      uni.sendSocketMessage({ data })
      // #endif

      return true
    } catch (error) {
      console.error('WebSocket发送消息失败:', error)
      return false
    }
  }

  /**
   * 订阅消息
   */
  subscribe(method: string, callback: Function): void {
    if (!this.subscriptions.has(method)) {
      this.subscriptions.set(method, [])
    }
    this.subscriptions.get(method)!.push(callback)
  }

  /**
   * 取消订阅
   */
  unsubscribe(method: string, callback?: Function): void {
    if (!this.subscriptions.has(method)) {
      return
    }

    if (callback) {
      const callbacks = this.subscriptions.get(method)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    } else {
      this.subscriptions.delete(method)
    }
  }

  /**
   * 开始心跳
   */
  private startPing(): void {
    this.clearTimers()
    
    this.pingTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === 1) {
        this.send({ method: 'ping' })
        
        // 设置pong超时
        this.pongTimer = setTimeout(() => {
          console.warn('WebSocket心跳超时，重新连接')
          this.reconnect()
        }, this.config.pongTimeout)
      }
    }, this.config.pingInterval)
  }

  /**
   * 清除pong定时器
   */
  private clearPongTimer(): void {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer)
      this.pongTimer = null
    }
  }

  /**
   * 清除所有定时器
   */
  private clearTimers(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
    this.clearPongTimer()
  }

  /**
   * 重新连接
   */
  reconnect(): void {
    this.close()
    this.connect().catch(error => {
      console.error('WebSocket重连失败:', error)
    })
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.clearTimers()
    
    if (this.ws) {
      // #ifdef H5
      this.ws.close()
      // #endif

      // #ifdef MP || APP-PLUS
      uni.closeSocket()
      // #endif
      
      this.ws = null
    }
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.isDestroyed = true
    this.close()
    this.subscriptions.clear()
    this.messageQueue = []
  }

  /**
   * 事件发射器
   */
  private listeners = new Map<string, Function[]>()

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback?: Function): void {
    if (!this.listeners.has(event)) {
      return
    }

    if (callback) {
      const callbacks = this.listeners.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    } else {
      this.listeners.delete(event)
    }
  }

  private emit(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data))
    }
  }

  /**
   * 获取连接状态
   */
  get readyState(): number {
    return this.ws ? this.ws.readyState : 3
  }

  /**
   * 是否已连接
   */
  get isConnected(): boolean {
    return this.ws && this.ws.readyState === 1
  }
}

// 创建全局WebSocket实例
let globalWS: WebSocketManager | null = null

/**
 * 创建WebSocket连接
 */
export function createWebSocket(config: WebSocketConfig): WebSocketManager {
  return new WebSocketManager(config)
}

/**
 * 获取全局WebSocket实例
 */
export function getGlobalWebSocket(): WebSocketManager | null {
  return globalWS
}

/**
 * 初始化全局WebSocket
 */
export function initGlobalWebSocket(config: WebSocketConfig): WebSocketManager {
  if (globalWS) {
    globalWS.destroy()
  }
  
  globalWS = new WebSocketManager(config)
  return globalWS
}

/**
 * 销毁全局WebSocket
 */
export function destroyGlobalWebSocket(): void {
  if (globalWS) {
    globalWS.destroy()
    globalWS = null
  }
}

export default WebSocketManager
