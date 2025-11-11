/**
 * 主题管理系统
 * 支持浅色/深色模式切换，自动跟随系统主题
 */

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeColors {
  // 背景色
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  
  // 文字色
  textPrimary: string
  textSecondary: string
  textTertiary: string
  
  // 品牌色
  brandPrimary: string
  brandSecondary: string
  
  // 功能色
  success: string
  warning: string
  error: string
  info: string
  
  // 边框色
  border: string
  borderSecondary: string
  
  // 特殊效果
  shadow: string
  overlay: string
  
  // 交易专用色
  buyColor: string
  sellColor: string
}

export interface Theme {
  mode: 'light' | 'dark'
  colors: ThemeColors
  isDark: boolean
}

// 浅色主题配色
export const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  colors: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#f1f3f4',
    
    textPrimary: '#212121',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    brandPrimary: '#6f4bfd',
    brandSecondary: '#9333ea',
    
    success: '#19af00',
    warning: '#ff9800',
    error: '#d92a2a',
    info: '#03a9f4',
    
    border: '#e5e5e5',
    borderSecondary: '#f0f0f0',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    buyColor: '#19af00',
    sellColor: '#d92a2a'
  }
}

// 深色主题配色
export const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  colors: {
    bgPrimary: '#121212',
    bgSecondary: '#1e1e1e',
    bgTertiary: '#242424',
    
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    textTertiary: '#888888',
    
    brandPrimary: '#8b5cf6',
    brandSecondary: '#a855f7',
    
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    
    border: '#333333',
    borderSecondary: '#2a2a2a',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    buyColor: '#22c55e',
    sellColor: '#ef4444'
  }
}

class ThemeManager {
  private currentTheme: Theme = lightTheme
  private themeMode: ThemeMode = 'light'
  private listeners: Set<(theme: Theme) => void> = new Set()
  private systemThemeListener: any = null

  constructor() {
    this.init()
  }

  /**
   * 初始化主题系统
   */
  private init() {
    // 从本地存储获取用户偏好
    const savedMode = uni.getStorageSync('theme_mode') as ThemeMode
    if (savedMode) {
      this.themeMode = savedMode
    }

    // 应用初始主题
    this.applyTheme()

    // 监听系统主题变化
    this.setupSystemThemeListener()
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): Theme {
    return this.currentTheme
  }

  /**
   * 获取当前主题模式
   */
  getThemeMode(): ThemeMode {
    return this.themeMode
  }

  /**
   * 设置主题模式
   */
  setThemeMode(mode: ThemeMode) {
    if (this.themeMode === mode) return

    this.themeMode = mode
    this.applyTheme()
    this.saveThemePreference()
  }

  /**
   * 切换主题模式
   */
  toggleTheme() {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(this.themeMode)
    const nextIndex = (currentIndex + 1) % modes.length
    this.setThemeMode(modes[nextIndex])
  }

  /**
   * 应用主题
   */
  private applyTheme() {
    let targetTheme: Theme

    if (this.themeMode === 'auto') {
      targetTheme = this.getSystemTheme()
    } else {
      targetTheme = this.themeMode === 'dark' ? darkTheme : lightTheme
    }

    this.currentTheme = targetTheme
    this.updateCSSVariables()
    this.notifyListeners()
  }

  /**
   * 获取系统主题
   */
  private getSystemTheme(): Theme {
    try {
      const systemInfo = uni.getSystemInfoSync()
      const isDarkMode = systemInfo.theme === 'dark'
      return isDarkMode ? darkTheme : lightTheme
    } catch (error) {
      console.warn('获取系统主题失败，使用默认浅色主题', error)
      return lightTheme
    }
  }

  /**
   * 设置系统主题监听器
   */
  private setupSystemThemeListener() {
    // #ifdef APP-PLUS
    try {
      if (plus.screen && plus.screen.lockOrientation) {
        // App端监听系统主题变化
        plus.globalEvent.addEventListener('themeChanged', () => {
          if (this.themeMode === 'auto') {
            this.applyTheme()
          }
        })
      }
    } catch (error) {
      console.warn('设置系统主题监听失败', error)
    }
    // #endif

    // #ifdef H5
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addListener(() => {
        if (this.themeMode === 'auto') {
          this.applyTheme()
        }
      })
      this.systemThemeListener = mediaQuery
    }
    // #endif
  }

  /**
   * 更新CSS变量
   */
  private updateCSSVariables() {
    const { colors } = this.currentTheme

    // 创建CSS变量映射
    const cssVariables = {
      '--theme-bg-primary': colors.bgPrimary,
      '--theme-bg-secondary': colors.bgSecondary,
      '--theme-bg-tertiary': colors.bgTertiary,
      '--theme-text-primary': colors.textPrimary,
      '--theme-text-secondary': colors.textSecondary,
      '--theme-text-tertiary': colors.textTertiary,
      '--theme-brand-primary': colors.brandPrimary,
      '--theme-brand-secondary': colors.brandSecondary,
      '--theme-success': colors.success,
      '--theme-warning': colors.warning,
      '--theme-error': colors.error,
      '--theme-info': colors.info,
      '--theme-border': colors.border,
      '--theme-border-secondary': colors.borderSecondary,
      '--theme-shadow': colors.shadow,
      '--theme-overlay': colors.overlay,
      '--theme-buy-color': colors.buyColor,
      '--theme-sell-color': colors.sellColor
    }

    // 应用CSS变量
    // #ifdef H5
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      Object.entries(cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }
    // #endif
  }

  /**
   * 添加主题变化监听器
   */
  addListener(callback: (theme: Theme) => void) {
    this.listeners.add(callback)
    
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 移除主题变化监听器
   */
  removeListener(callback: (theme: Theme) => void) {
    this.listeners.delete(callback)
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentTheme)
      } catch (error) {
        console.error('主题监听器执行失败', error)
      }
    })
  }

  /**
   * 保存主题偏好到本地
   */
  private saveThemePreference() {
    try {
      uni.setStorageSync('theme_mode', this.themeMode)
    } catch (error) {
      console.error('保存主题偏好失败', error)
    }
  }

  /**
   * 生成主题相关的样式类名
   */
  getThemeClasses(): string[] {
    const classes = [`theme-${this.currentTheme.mode}`]
    
    if (this.currentTheme.isDark) {
      classes.push('theme-dark')
    } else {
      classes.push('theme-light')
    }
    
    return classes
  }

  /**
   * 获取主题相关的状态栏样式
   */
  getStatusBarStyle() {
    return {
      backgroundColor: this.currentTheme.colors.bgPrimary,
      style: this.currentTheme.isDark ? 'light' : 'dark'
    }
  }

  /**
   * 获取导航栏样式
   */
  getNavigationBarStyle() {
    return {
      backgroundColor: this.currentTheme.colors.bgPrimary,
      titleColor: this.currentTheme.colors.textPrimary,
      frontColor: this.currentTheme.isDark ? '#ffffff' : '#000000'
    }
  }

  /**
   * 销毁主题管理器
   */
  destroy() {
    this.listeners.clear()
    
    // #ifdef H5
    if (this.systemThemeListener && this.systemThemeListener.removeListener) {
      this.systemThemeListener.removeListener()
    }
    // #endif
  }
}

// 创建全局主题管理器实例
export const themeManager = new ThemeManager()

// 便捷方法
export const getCurrentTheme = () => themeManager.getCurrentTheme()
export const getThemeMode = () => themeManager.getThemeMode()
export const setThemeMode = (mode: ThemeMode) => themeManager.setThemeMode(mode)
export const toggleTheme = () => themeManager.toggleTheme()
export const addThemeListener = (callback: (theme: Theme) => void) => 
  themeManager.addListener(callback)

// Vue组合式API
export const useTheme = () => {
  const theme = ref(themeManager.getCurrentTheme())
  const themeMode = ref(themeManager.getThemeMode())
  
  const unsubscribe = themeManager.addListener((newTheme) => {
    theme.value = newTheme
    themeMode.value = themeManager.getThemeMode()
  })
  
  onUnmounted(() => {
    unsubscribe()
  })
  
  return {
    theme: readonly(theme),
    themeMode: readonly(themeMode),
    setThemeMode: (mode: ThemeMode) => themeManager.setThemeMode(mode),
    toggleTheme: () => themeManager.toggleTheme(),
    getThemeClasses: () => themeManager.getThemeClasses()
  }
}

import { onUnmounted, readonly, ref } from 'vue'

export default themeManager
