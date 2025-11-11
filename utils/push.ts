/**
 * 推送通知管理系统
 * 支持价格预警、订单状态、系统通知等多种推送类型
 */

export interface PushConfig {
  // 推送类型开关
  priceAlert: boolean
  orderStatus: boolean
  systemNotice: boolean
  depositWithdraw: boolean
  security: boolean
  
  // 推送时间配置
  enabledHours: {
    start: number // 0-23
    end: number   // 0-23
  }
  
  // 推送声音
  soundEnabled: boolean
  vibrationEnabled: boolean
}

export interface PushMessage {
  id: string
  type: 'price_alert' | 'order_status' | 'system' | 'deposit' | 'withdraw' | 'security'
  title: string
  content: string
  data?: any
  timestamp: number
  read: boolean
}

export class PushNotificationManager {
  private config: PushConfig
  private callbacks: Map<string, (message: PushMessage) => void>
  private messageQueue: PushMessage[]

  constructor() {
    this.config = {
      priceAlert: true,
      orderStatus: true,
      systemNotice: true,
      depositWithdraw: true,
      security: true,
      enabledHours: { start: 8, end: 22 },
      soundEnabled: true,
      vibrationEnabled: true
    }
    this.callbacks = new Map()
    this.messageQueue = []
    
    this.initPushNotification()
  }

  /**
   * 初始化推送服务
   */
  private async initPushNotification() {
    try {
      // #ifdef APP-PLUS
      // App端推送初始化
      const pushInfo = await this.initAppPush()
      console.log('App推送初始化成功:', pushInfo)
      // #endif

      // #ifdef MP-WEIXIN
      // 小程序订阅消息初始化
      await this.initWechatSubscribe()
      // #endif

      // #ifdef H5
      // H5端通知权限申请
      await this.initWebNotification()
      // #endif
    } catch (error) {
      console.error('推送服务初始化失败:', error)
    }
  }

  /**
   * App端推送初始化
   */
  private async initAppPush(): Promise<any> {
    return new Promise((resolve, reject) => {
      // #ifdef APP-PLUS
      const pushService = plus.push.getClientInfo()
      
      // 监听推送消息
      plus.push.addEventListener('click', (message) => {
        this.handlePushClick(message)
      })
      
      plus.push.addEventListener('receive', (message) => {
        this.handlePushReceive(message)
      })
      
      resolve(pushService)
      // #endif
      
      // 非App环境
      resolve(null)
    })
  }

  /**
   * 小程序订阅消息初始化
   */
  private async initWechatSubscribe() {
    // #ifdef MP-WEIXIN
    try {
      // 获取订阅消息模板
      const templates = [
        'price_alert_template',    // 价格预警
        'order_status_template',   // 订单状态  
        'deposit_template',        // 充值到账
        'withdraw_template',       // 提现状态
        'security_template'        // 安全提醒
      ]
      
      const result = await uni.requestSubscribeMessage({
        tmplIds: templates
      })
      
      console.log('订阅消息授权结果:', result)
    } catch (error) {
      console.warn('订阅消息授权失败:', error)
    }
    // #endif
  }

  /**
   * H5端通知权限申请
   */
  private async initWebNotification() {
    // #ifdef H5
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        console.log('H5通知权限:', permission)
      }
    }
    // #endif
  }

  /**
   * 更新推送配置
   */
  updateConfig(newConfig: Partial<PushConfig>) {
    this.config = { ...this.config, ...newConfig }
    
    // 保存到本地存储
    uni.setStorageSync('push_config', this.config)
  }

  /**
   * 获取推送配置
   */
  getConfig(): PushConfig {
    return { ...this.config }
  }

  /**
   * 注册消息回调
   */
  onMessage(type: string, callback: (message: PushMessage) => void) {
    this.callbacks.set(type, callback)
  }

  /**
   * 移除消息回调
   */
  offMessage(type: string) {
    this.callbacks.delete(type)
  }

  /**
   * 发送本地通知
   */
  async showLocalNotification(message: PushMessage) {
    // 检查推送开关
    if (!this.shouldShowNotification(message.type)) {
      return
    }

    // 检查推送时间
    if (!this.isInAllowedHours()) {
      this.messageQueue.push(message)
      return
    }

    try {
      // #ifdef APP-PLUS
      await this.showAppNotification(message)
      // #endif

      // #ifdef H5  
      await this.showWebNotification(message)
      // #endif

      // #ifdef MP-WEIXIN || MP-ALIPAY
      await this.showMiniProgramNotification(message)
      // #endif
    } catch (error) {
      console.error('显示本地通知失败:', error)
    }
  }

  /**
   * App端通知显示
   */
  private async showAppNotification(message: PushMessage) {
    // #ifdef APP-PLUS
    plus.push.createMessage(message.content, '', {
      title: message.title,
      when: new Date(),
      sound: this.config.soundEnabled ? 'system' : 'none',
      vibrate: this.config.vibrationEnabled
    })
    // #endif
  }

  /**
   * H5端通知显示
   */
  private async showWebNotification(message: PushMessage) {
    // #ifdef H5
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(message.title, {
        body: message.content,
        icon: '/static/icons/notification-icon.png',
        tag: message.id,
        requireInteraction: false,
        silent: !this.config.soundEnabled
      })
      
      notification.onclick = () => {
        this.handleNotificationClick(message)
        notification.close()
      }
      
      // 自动关闭
      setTimeout(() => notification.close(), 5000)
    }
    // #endif
  }

  /**
   * 小程序通知显示
   */
  private async showMiniProgramNotification(message: PushMessage) {
    // 小程序内显示Toast或Modal
    uni.showToast({
      title: message.title,
      icon: 'none',
      duration: 3000
    })
  }

  /**
   * 创建价格预警通知
   */
  createPriceAlert(symbol: string, price: string, direction: 'above' | 'below') {
    const message: PushMessage = {
      id: `price_alert_${Date.now()}`,
      type: 'price_alert',
      title: '价格预警',
      content: `${symbol} 价格${direction === 'above' ? '突破' : '跌破'} ${price}`,
      data: { symbol, price, direction },
      timestamp: Date.now(),
      read: false
    }
    
    this.showLocalNotification(message)
    this.notifyCallbacks('price_alert', message)
  }

  /**
   * 创建订单状态通知
   */
  createOrderNotification(orderId: string, status: string, symbol: string) {
    const statusText = {
      'filled': '已成交',
      'cancelled': '已撤销',
      'partially_filled': '部分成交'
    }[status] || '状态更新'

    const message: PushMessage = {
      id: `order_${orderId}_${Date.now()}`,
      type: 'order_status',
      title: '订单状态更新',
      content: `${symbol} 订单${statusText}`,
      data: { orderId, status, symbol },
      timestamp: Date.now(),
      read: false
    }
    
    this.showLocalNotification(message)
    this.notifyCallbacks('order_status', message)
  }

  /**
   * 创建充值到账通知
   */
  createDepositNotification(asset: string, amount: string, txId: string) {
    const message: PushMessage = {
      id: `deposit_${txId}`,
      type: 'deposit',
      title: '充值到账',
      content: `${amount} ${asset} 已成功充值到您的账户`,
      data: { asset, amount, txId },
      timestamp: Date.now(),
      read: false
    }
    
    this.showLocalNotification(message)
    this.notifyCallbacks('deposit', message)
  }

  /**
   * 创建安全提醒通知
   */
  createSecurityAlert(type: string, location: string, ip: string) {
    const message: PushMessage = {
      id: `security_${Date.now()}`,
      type: 'security',
      title: '安全提醒',
      content: `检测到${type}操作，地点：${location}`,
      data: { type, location, ip },
      timestamp: Date.now(),
      read: false
    }
    
    this.showLocalNotification(message)
    this.notifyCallbacks('security', message)
  }

  /**
   * 检查是否应该显示通知
   */
  private shouldShowNotification(type: PushMessage['type']): boolean {
    switch (type) {
      case 'price_alert':
        return this.config.priceAlert
      case 'order_status':
        return this.config.orderStatus
      case 'system':
        return this.config.systemNotice
      case 'deposit':
      case 'withdraw':
        return this.config.depositWithdraw
      case 'security':
        return this.config.security
      default:
        return true
    }
  }

  /**
   * 检查是否在允许的推送时间内
   */
  private isInAllowedHours(): boolean {
    const now = new Date()
    const currentHour = now.getHours()
    const { start, end } = this.config.enabledHours
    
    if (start <= end) {
      return currentHour >= start && currentHour <= end
    } else {
      // 跨越午夜的情况
      return currentHour >= start || currentHour <= end
    }
  }

  /**
   * 处理推送点击
   */
  private handlePushClick(message: any) {
    console.log('推送消息点击:', message)
    
    // 根据消息类型进行相应的页面跳转
    if (message.payload) {
      const data = JSON.parse(message.payload)
      this.navigateByMessageType(data.type, data)
    }
  }

  /**
   * 处理推送接收
   */
  private handlePushReceive(message: any) {
    console.log('接收到推送消息:', message)
    
    // 创建内部消息对象
    const internalMessage: PushMessage = {
      id: message.id || String(Date.now()),
      type: message.type || 'system',
      title: message.title || '通知',
      content: message.content || '',
      data: message.payload ? JSON.parse(message.payload) : {},
      timestamp: Date.now(),
      read: false
    }
    
    this.notifyCallbacks('receive', internalMessage)
  }

  /**
   * 通知回调函数
   */
  private notifyCallbacks(event: string, message: PushMessage) {
    const callback = this.callbacks.get(event)
    if (callback) {
      callback(message)
    }
    
    // 通知全局回调
    const globalCallback = this.callbacks.get('*')
    if (globalCallback) {
      globalCallback(message)
    }
  }

  /**
   * 根据消息类型进行页面导航
   */
  private navigateByMessageType(type: string, data: any) {
    switch (type) {
      case 'price_alert':
        uni.navigateTo({ 
          url: `/pages/market/index?symbol=${data.symbol}` 
        })
        break
      case 'order_status':
        uni.navigateTo({ 
          url: `/pages/trade/orders?orderId=${data.orderId}` 
        })
        break
      case 'deposit':
      case 'withdraw':
        uni.navigateTo({ 
          url: `/pages/assets/history?type=${type}` 
        })
        break
      case 'security':
        uni.navigateTo({ 
          url: '/pages/profile/security' 
        })
        break
      default:
        // 默认跳转到首页（无系统 tabBar 时使用 reLaunch）
        uni.reLaunch({ url: '/pages/home/index' })
    }
  }

  /**
   * 处理通知点击
   */
  private handleNotificationClick(message: PushMessage) {
    this.navigateByMessageType(message.type, message.data)
    
    // 标记消息为已读
    message.read = true
  }

  /**
   * 获取待推送的消息队列
   */
  getPendingMessages(): PushMessage[] {
    return [...this.messageQueue]
  }

  /**
   * 清空消息队列
   */
  clearMessageQueue() {
    this.messageQueue = []
  }

  /**
   * 销毁推送服务
   */
  destroy() {
    this.callbacks.clear()
    this.messageQueue = []
    
    // #ifdef APP-PLUS
    plus.push.clear()
    // #endif
  }
}

// 创建全局推送管理实例
export const pushManager = new PushNotificationManager()

// 便捷方法导出
export const createPriceAlert = (symbol: string, price: string, direction: 'above' | 'below') => {
  pushManager.createPriceAlert(symbol, price, direction)
}

export const createOrderNotification = (orderId: string, status: string, symbol: string) => {
  pushManager.createOrderNotification(orderId, status, symbol)
}

export const createDepositNotification = (asset: string, amount: string, txId: string) => {
  pushManager.createDepositNotification(asset, amount, txId)
}

export const createSecurityAlert = (type: string, location: string, ip: string) => {
  pushManager.createSecurityAlert(type, location, ip)
}

export default pushManager
