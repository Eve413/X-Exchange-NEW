/**
 * 性能监控工具
 * 用于监控应用性能指标，包括页面加载时间、内存使用、FPS等
 */

export interface PerformanceMetrics {
  // 页面性能
  pageLoadTime: number
  domReadyTime: number
  resourceLoadTime: number
  
  // 渲染性能
  fps: number
  frameTime: number
  renderTime: number
  
  // 内存使用
  memoryUsage: {
    used: number
    total: number
    available: number
  }
  
  // 网络性能
  networkType: string
  downloadSpeed: number
  
  // 设备信息
  deviceInfo: {
    platform: string
    system: string
    model: string
    screenSize: { width: number; height: number }
  }
  
  // 自定义指标
  customMetrics: Record<string, number>
}

export interface PerformanceConfig {
  // 是否启用性能监控
  enabled: boolean
  
  // 采样率（0-1）
  sampleRate: number
  
  // 监控间隔（毫秒）
  interval: number
  
  // 是否上报性能数据
  reportEnabled: boolean
  
  // 上报阈值（低于阈值不上报）
  reportThresholds: {
    fps: number
    memoryUsage: number
    loadTime: number
  }
}

class PerformanceMonitor {
  private config: PerformanceConfig
  private metrics: Partial<PerformanceMetrics> = {}
  private timers: Map<string, number> = new Map()
  private observers: Map<string, any> = new Map()
  private frameCount = 0
  private lastFrameTime = 0
  private startTime = Date.now()

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      interval: 1000,
      reportEnabled: false,
      reportThresholds: {
        fps: 30,
        memoryUsage: 0.8,
        loadTime: 3000
      },
      ...config
    }

    if (this.config.enabled && this.shouldSample()) {
      this.init()
    }
  }

  /**
   * 初始化性能监控
   */
  private init() {
    this.collectDeviceInfo()
    this.startFPSMonitoring()
    this.startMemoryMonitoring()
    this.startNetworkMonitoring()
    this.setupPerformanceObserver()
  }

  /**
   * 判断是否应该采样
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate
  }

  /**
   * 收集设备信息
   */
  private collectDeviceInfo() {
    try {
      const systemInfo = uni.getSystemInfoSync()
      
      this.metrics.deviceInfo = {
        platform: systemInfo.platform,
        system: systemInfo.system,
        model: systemInfo.model || 'Unknown',
        screenSize: {
          width: systemInfo.screenWidth,
          height: systemInfo.screenHeight
        }
      }
    } catch (error) {
      console.warn('获取设备信息失败:', error)
    }
  }

  /**
   * 开始FPS监控
   */
  private startFPSMonitoring() {
    let lastTime = 0
    const frames: number[] = []

    const measureFPS = (currentTime: number) => {
      if (lastTime === 0) {
        lastTime = currentTime
        requestAnimationFrame(measureFPS)
        return
      }

      const deltaTime = currentTime - lastTime
      frames.push(1000 / deltaTime)

      // 保持最近60帧的数据
      if (frames.length > 60) {
        frames.shift()
      }

      // 计算平均FPS
      if (frames.length > 0) {
        this.metrics.fps = Math.round(
          frames.reduce((sum, fps) => sum + fps, 0) / frames.length
        )
        this.metrics.frameTime = deltaTime
      }

      lastTime = currentTime
      requestAnimationFrame(measureFPS)
    }

    // #ifdef H5
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(measureFPS)
    }
    // #endif

    // #ifndef H5
    // 在非H5环境中使用定时器模拟
    setInterval(() => {
      const now = Date.now()
      if (this.lastFrameTime > 0) {
        const deltaTime = now - this.lastFrameTime
        frames.push(1000 / deltaTime)
        
        if (frames.length > 60) {
          frames.shift()
        }
        
        if (frames.length > 0) {
          this.metrics.fps = Math.round(
            frames.reduce((sum, fps) => sum + fps, 0) / frames.length
          )
        }
      }
      this.lastFrameTime = now
    }, 16) // ~60fps
    // #endif
  }

  /**
   * 开始内存监控
   */
  private startMemoryMonitoring() {
    const measureMemory = () => {
      // #ifdef APP-PLUS
      try {
        if (plus.device && plus.device.memory) {
          const memory = plus.device.memory()
          this.metrics.memoryUsage = {
            used: memory.used || 0,
            total: memory.total || 0,
            available: memory.available || 0
          }
        }
      } catch (error) {
        console.warn('获取内存信息失败:', error)
      }
      // #endif

      // #ifdef H5
      if (performance && (performance as any).memory) {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = {
          used: memory.usedJSHeapSize || 0,
          total: memory.totalJSHeapSize || 0,
          available: memory.jsHeapSizeLimit - memory.usedJSHeapSize || 0
        }
      }
      // #endif
    }

    measureMemory()
    setInterval(measureMemory, this.config.interval)
  }

  /**
   * 开始网络监控
   */
  private startNetworkMonitoring() {
    uni.getNetworkType({
      success: (res) => {
        this.metrics.networkType = res.networkType
      }
    })

    // 监听网络状态变化
    uni.onNetworkStatusChange((res) => {
      this.metrics.networkType = res.networkType
    })
  }

  /**
   * 设置性能观察器
   */
  private setupPerformanceObserver() {
    // #ifdef H5
    if (typeof PerformanceObserver === 'function') {
      try {
        // 监控导航性能
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.navigationStart
              this.metrics.domReadyTime = navEntry.domContentLoadedEventEnd - navEntry.navigationStart
              this.metrics.resourceLoadTime = navEntry.loadEventEnd - navEntry.domContentLoadedEventEnd
            }
          }
        })
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.set('navigation', navObserver)

        // 监控资源加载性能
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming
              // 可以根据需要处理资源加载性能数据
              this.handleResourceTiming(resourceEntry)
            }
          }
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.set('resource', resourceObserver)

      } catch (error) {
        console.warn('PerformanceObserver 设置失败:', error)
      }
    }
    // #endif
  }

  /**
   * 处理资源加载时间
   */
  private handleResourceTiming(entry: PerformanceResourceTiming) {
    const loadTime = entry.responseEnd - entry.startTime
    
    // 统计慢加载资源
    if (loadTime > 1000) {
      console.warn(`慢加载资源: ${entry.name}, 加载时间: ${loadTime}ms`)
    }
  }

  /**
   * 开始计时
   */
  startTiming(name: string) {
    this.timers.set(name, Date.now())
  }

  /**
   * 结束计时
   */
  endTiming(name: string): number {
    const startTime = this.timers.get(name)
    if (startTime) {
      const duration = Date.now() - startTime
      this.timers.delete(name)
      
      // 记录自定义指标
      if (!this.metrics.customMetrics) {
        this.metrics.customMetrics = {}
      }
      this.metrics.customMetrics[name] = duration
      
      return duration
    }
    return 0
  }

  /**
   * 记录自定义指标
   */
  recordMetric(name: string, value: number) {
    if (!this.metrics.customMetrics) {
      this.metrics.customMetrics = {}
    }
    this.metrics.customMetrics[name] = value
  }

  /**
   * 标记用户交互
   */
  markUserInteraction(action: string) {
    const timestamp = Date.now() - this.startTime
    this.recordMetric(`user_${action}`, timestamp)
  }

  /**
   * 获取当前性能指标
   */
  getMetrics(): PerformanceMetrics {
    return {
      pageLoadTime: 0,
      domReadyTime: 0,
      resourceLoadTime: 0,
      fps: 60,
      frameTime: 16.67,
      renderTime: 0,
      memoryUsage: {
        used: 0,
        total: 0,
        available: 0
      },
      networkType: 'unknown',
      downloadSpeed: 0,
      deviceInfo: {
        platform: 'unknown',
        system: 'unknown',
        model: 'unknown',
        screenSize: { width: 0, height: 0 }
      },
      customMetrics: {},
      ...this.metrics
    } as PerformanceMetrics
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const metrics = this.getMetrics()
    const issues: string[] = []

    // 检查性能问题
    if (metrics.fps < this.config.reportThresholds.fps) {
      issues.push(`低FPS: ${metrics.fps}`)
    }

    if (metrics.memoryUsage.used / metrics.memoryUsage.total > this.config.reportThresholds.memoryUsage) {
      issues.push(`高内存使用: ${Math.round(metrics.memoryUsage.used / metrics.memoryUsage.total * 100)}%`)
    }

    if (metrics.pageLoadTime > this.config.reportThresholds.loadTime) {
      issues.push(`慢页面加载: ${metrics.pageLoadTime}ms`)
    }

    return {
      timestamp: Date.now(),
      metrics,
      issues,
      deviceInfo: metrics.deviceInfo
    } as any
  }

  /**
   * 上报性能数据
   */
  async reportMetrics() {
    if (!this.config.reportEnabled) return

    try {
      const report = this.generateReport()
      
      // 这里可以发送到性能监控服务
      console.log('性能报告:', report)
      
      // 示例：发送到服务器
      // await this.sendToServer(report)
      
    } catch (error) {
      console.error('性能数据上报失败:', error)
    }
  }

  /**
   * 清理资源
   */
  destroy() {
    // 清理定时器
    this.timers.clear()

    // 清理观察器
    this.observers.forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect()
      }
    })
    this.observers.clear()
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()

// 便捷方法
export const startTiming = (name: string) => performanceMonitor.startTiming(name)
export const endTiming = (name: string) => performanceMonitor.endTiming(name)
export const recordMetric = (name: string, value: number) => performanceMonitor.recordMetric(name, value)
export const markUserInteraction = (action: string) => performanceMonitor.markUserInteraction(action)
export const getPerformanceMetrics = () => performanceMonitor.getMetrics()

// 页面性能测量装饰器
export function measurePagePerformance(pageName: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args: any[]) {
      startTiming(`page_${pageName}`)
      
      try {
        const result = await originalMethod.apply(this, args)
        return result
      } finally {
        endTiming(`page_${pageName}`)
      }
    }

    return descriptor
  }
}

// API调用性能测量
export function measureApiCall<T>(
  apiCall: () => Promise<T>,
  apiName: string
): Promise<T> {
  startTiming(`api_${apiName}`)
  
  return apiCall()
    .finally(() => {
      endTiming(`api_${apiName}`)
    })
}

export default performanceMonitor
