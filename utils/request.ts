import { useUserStore } from '@/store/modules/user'

// 请求配置接口
interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  timeout?: number
  loading?: boolean
  showError?: boolean
}

// 响应数据接口
interface ResponseData<T = any> {
  code: number
  data: T
  message: string
  timestamp: number
}

// 仅在 H5 开发环境使用本地代理，其它平台直接走线上域名
// 平台常量由 vite.config.ts 的 define 注入到运行时
const UNI_PLATFORM = (globalThis as any)?.UNI_PLATFORM || ''
const isH5Platform = UNI_PLATFORM === 'h5'
const DEV_USE_PROXY = import.meta.env.DEV && isH5Platform

const BASE_URL = DEV_USE_PROXY
  ? '/apiBase'
  : 'https://api.icoinkey.com'

const BASE_URL_CRYPTO = DEV_USE_PROXY
  ? '/cryptoBase'
  : 'https://crypto.icoinkey.com'

const DEFAULT_TIMEOUT = 20000

class Request {
  private interceptors = {
    request: [] as Array<(config: RequestConfig) => RequestConfig>,
    response: [] as Array<(response: any) => any>
  }

  constructor() {
    this.setupInterceptors()
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.interceptors.request.push((config) => {
      const userStore = useUserStore()
      
      // 添加认证头
      if (userStore.token) {
        config.header = {
          ...config.header,
          'Authorization': `Bearer ${userStore.token}`
        }
      }
      
      // 添加通用头部
      config.header = {
        'Content-Type': 'application/json',
        'x-api-key' : userStore.token,
        ...config.header
      }
      
      return config
    })

    // 响应拦截器
    this.interceptors.response.push((response) => {
      const { data, statusCode } = response
      
      // 处理HTTP状态码
      if (statusCode !== 200) {
        throw new Error(`HTTP Error: ${statusCode}`)
      }
      

      console.log("data")
      console.log(data)
      // 处理业务状态码
      // if (data.code !== 0) {
      //   // token过期处理
      //   if (data.code === 401) {
      //     const userStore = useUserStore()
      //     userStore.logout()
      //     uni.reLaunch({ url: '/pages/auth/login/index' })
      //   }
      //   throw new Error(data.message || '请求失败')
      // }
      
      return data
    })

    // 在开发环境输出当前基础地址，便于诊断 file:// 场景
    if (import.meta.env.DEV) {
      console.log('[HTTP] BASE_URL:', BASE_URL, 'CRYPTO:', BASE_URL_CRYPTO, 'UNI_PLATFORM:', UNI_PLATFORM, 'useProxy:', DEV_USE_PROXY)
    }
  }

  // 核心请求方法
  async request<T = any>(config: RequestConfig): Promise<ResponseData<T>> {
    // 显示loading
    if (config.loading !== false) {
      uni.showLoading({ title: '加载中...' })
    }

    try {
      // 应用请求拦截器
      let processedConfig = config
      for (const interceptor of this.interceptors.request) {
        processedConfig = interceptor(processedConfig)
      }

      // 构建完整URL
      const fullUrl = processedConfig.url.startsWith('http') 
        ? processedConfig.url 
        : `${BASE_URL}${processedConfig.url}`

      // 开发环境调试日志
      if (import.meta.env.DEV) {
        console.log('[HTTP]', processedConfig.method || 'GET', fullUrl)
      }

      // 发起请求
      const response = await uni.request({
        url: fullUrl,
        method: processedConfig.method || 'GET',
        data: processedConfig.data,
        header: processedConfig.header,
        timeout: processedConfig.timeout || DEFAULT_TIMEOUT
      })

      // 应用响应拦截器
      let processedResponse = response
      for (const interceptor of this.interceptors.response) {
        processedResponse = interceptor(processedResponse)
      }

      return processedResponse as ResponseData<T>

    } catch (error: any) {
      console.error('请求错误:', error)
      
      if (config.showError !== false) {
        uni.showToast({
          title: error.message || '网络请求失败',
          icon: 'none',
          duration: 2000
        })
      }
      
      throw error
    } finally {
      if (config.loading !== false) {
        uni.hideLoading()
      }
    }
  }

  async requestCrypto<T = any>(config: RequestConfig): Promise<ResponseData<T>> {
    // 显示loading
    if (config.loading !== false) {
      uni.showLoading({ title: '加载中...' })
    }

    try {
      // 应用请求拦截器
      let processedConfig = config
      for (const interceptor of this.interceptors.request) {
        processedConfig = interceptor(processedConfig)
      }

      // 构建完整URL
      const fullUrl = processedConfig.url.startsWith('http') 
        ? processedConfig.url 
        : `${BASE_URL_CRYPTO}${processedConfig.url}`

      // 开发环境调试日志
      if (import.meta.env.DEV) {
        console.log('[HTTP]', processedConfig.method || 'GET', fullUrl)
      }

      // 发起请求
      const response = await uni.request({
        url: fullUrl,
        method: processedConfig.method || 'GET',
        data: processedConfig.data,
        header: processedConfig.header,
        timeout: processedConfig.timeout || DEFAULT_TIMEOUT
      })

      // 应用响应拦截器
      let processedResponse = response
      for (const interceptor of this.interceptors.response) {
        processedResponse = interceptor(processedResponse)
      }

      return processedResponse as ResponseData<T>

    } catch (error: any) {
      console.error('请求错误:', error)
      
      if (config.showError !== false) {
        uni.showToast({
          title: error.message || '网络请求失败',
          icon: 'none',
          duration: 2000
        })
      }
      
      throw error
    } finally {
      if (config.loading !== false) {
        uni.hideLoading()
      }
    }
  }

  // GET请求
  get<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.request<T>({
      url,
      method: 'GET',
      data,
      ...config
    })
  }

   // GET请求
  getCripto<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.requestCrypto<T>({
      url,
      method: 'GET',
      data,
      ...config
    })
  }
  

  // POST请求
  post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  // PUT请求
  put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  // DELETE请求
  delete<T = any>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...config
    })
  }

  // 上传文件
  async upload(filePath: string, url: string, formData?: Record<string, any>) {
    const userStore = useUserStore()
    
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
        filePath,
        name: 'file',
        formData,
        header: {
          'Authorization': `Bearer ${userStore.token}`
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 0) {
              resolve(data)
            } else {
              reject(new Error(data.message))
            }
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }
}

export const request = new Request()
export default request