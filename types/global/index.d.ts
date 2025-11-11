/**
 * 全局类型定义
 */

// 导入其他全局类型文件
import './uni'
import './uniapp'
import './vue'

declare global {
  // Uniapp 全局类型扩展
  namespace UniApp {
    interface PageInstance {
      onPullDownRefresh?(): void
      onReachBottom?(): void
      onTabItemTap?(item: any): void
    }
  }

  // 环境变量类型
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      UNI_PLATFORM: 'app' | 'h5' | 'mp-weixin' | 'mp-alipay'
      VUE_APP_TITLE: string
      VUE_APP_BASE_URL: string
    }
  }

  // 通用响应类型
  interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
    timestamp: number
  }

  // 分页数据类型
  interface PaginationData<T = any> {
    list: T[]
    total: number
    current: number
    size: number
    pages: number
  }

  // 系统信息类型
  interface SystemInfo {
    platform: string
    system: string
    version: string
    screenWidth: number
    screenHeight: number
    statusBarHeight: number
    safeAreaInsets: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }

  // 网络状态类型
  type NetworkType = 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none'

  // 主题类型
  type ThemeType = 'light' | 'dark' | 'auto'

  // 语言类型
  type LanguageType = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR'
}

// 组件属性类型
export interface ComponentProps {
  class?: string
  style?: string | Record<string, any>
}

// 事件处理器类型
export interface EventHandler<T = any> {
  (event: T): void
}

// 表单验证规则类型
export interface ValidationRule {
  required?: boolean
  pattern?: RegExp
  min?: number
  max?: number
  message: string
  validator?: (value: any) => boolean | Promise<boolean>
}

// 选项类型
export interface OptionItem {
  label: string
  value: any
  disabled?: boolean
  children?: OptionItem[]
}

export { }
