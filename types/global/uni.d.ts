/**
 * Uniapp 全局类型补充
 */

// 扩展 uni 对象的类型定义
declare const uni: {
  // 网络请求
  request: (options: UniApp.RequestOptions) => UniApp.RequestTask
  
  // 导航
  navigateTo: (options: UniApp.NavigateToOptions) => void
  navigateBack: (options?: UniApp.NavigateBackOptions) => void
  switchTab: (options: UniApp.SwitchTabOptions) => void
  reLaunch: (options: UniApp.ReLaunchOptions) => void
  redirectTo: (options: UniApp.RedirectToOptions) => void
  
  // 界面
  showToast: (options: UniApp.ShowToastOptions) => void
  showLoading: (options: UniApp.ShowLoadingOptions) => void
  hideLoading: () => void
  showModal: (options: UniApp.ShowModalOptions) => void
  
  // 存储
  setStorageSync: (key: string, data: any) => void
  getStorageSync: (key: string) => any
  removeStorageSync: (key: string) => void
  clearStorageSync: () => void
  
  // 系统信息
  getSystemInfoSync: () => UniApp.GetSystemInfoResult
  
  // 网络状态
  onNetworkStatusChange: (callback: (result: UniApp.OnNetworkStatusChangeResult) => void) => void
  
  // 登录
  login: (options: UniApp.LoginOptions) => void
  
  // WebSocket
  connectSocket: (options: UniApp.ConnectSocketOptions) => UniApp.SocketTask
  onSocketOpen: (callback: (result: any) => void) => void
  onSocketMessage: (callback: (result: any) => void) => void
  onSocketClose: (callback: (result: any) => void) => void
  onSocketError: (callback: (result: any) => void) => void
  sendSocketMessage: (options: UniApp.SendSocketMessageOptions) => void
  closeSocket: (options?: UniApp.CloseSocketOptions) => void
  
  // 剪贴板
  setClipboardData: (options: UniApp.SetClipboardDataOptions) => void
  
  // 语言设置
  setLocale?: (locale: string) => void
  getLocale: () => string
}

// 扩展全局类型
declare global {
  const uni: typeof uni
  
  // 页面生命周期类型
  interface PageLifecycle {
    onLoad?(options: any): void
    onShow?(): void
    onReady?(): void
    onHide?(): void
    onUnload?(): void
    onPullDownRefresh?(): void
    onReachBottom?(): void
    onTabItemTap?(item: any): void
    onShareAppMessage?(options: any): any
    onPageScroll?(options: { scrollTop: number }): void
    onNavigationBarButtonTap?(options: any): void
    onBackPress?(): boolean
  }
}

export { }

