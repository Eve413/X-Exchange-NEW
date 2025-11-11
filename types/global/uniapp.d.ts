/**
 * Uniapp 相关类型定义
 */

declare global {
  const uni: any
  const plus: any
  const wx: any
  
  // 页面生命周期
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
    onNavigationBarSearchInputChanged?(options: any): void
    onNavigationBarSearchInputConfirmed?(options: any): void
    onNavigationBarSearchInputClicked?(): void
  }

  // 应用生命周期
  interface AppLifecycle {
    onLaunch?(options: any): void
    onShow?(options: any): void
    onHide?(): void
    onError?(error: string): void
    onPageNotFound?(options: any): void
    onThemeChange?(options: any): void
  }
}

export {} 