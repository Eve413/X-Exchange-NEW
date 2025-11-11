/**
 * Toast 提示工具
 */

export interface ToastOptions {
  title?: string
  icon?: 'success' | 'error' | 'loading' | 'none'
  duration?: number
  mask?: boolean
  position?: 'top' | 'center' | 'bottom'
}

export class Toast {
  // 成功提示
  static success(title: string, options?: Partial<ToastOptions>): void {
    uni.showToast({
      title,
      icon: 'success',
      duration: 2000,
      mask: false,
      ...options
    })
  }

  // 错误提示
  static error(title: string, options?: Partial<ToastOptions>): void {
    uni.showToast({
      title,
      icon: 'error',
      duration: 3000,
      mask: false,
      ...options
    })
  }

  // 加载提示
  static loading(title: string = '加载中...', mask: boolean = true): void {
    uni.showLoading({
      title,
      mask
    })
  }

  // 隐藏加载提示
  static hideLoading(): void {
    uni.hideLoading()
  }

  // 普通提示
  static show(title: string, options?: Partial<ToastOptions>): void {
    uni.showToast({
      title,
      icon: 'none',
      duration: 2000,
      mask: false,
      ...options
    })
  }

  // 警告提示
  static warning(title: string, options?: Partial<ToastOptions>): void {
    uni.showToast({
      title,
      icon: 'none',
      duration: 2500,
      mask: false,
      ...options
    })
  }

  // 信息提示
  static info(title: string, options?: Partial<ToastOptions>): void {
    uni.showToast({
      title,
      icon: 'none',
      duration: 2000,
      mask: false,
      ...options
    })
  }

  // 隐藏提示
  static hide(): void {
    uni.hideToast()
  }
}

// 模态框工具
export class Modal {
  // 确认对话框
  static confirm(
    content: string, 
    title: string = '提示',
    options?: {
      confirmText?: string
      cancelText?: string
      confirmColor?: string
      cancelColor?: string
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        confirmText: options?.confirmText || '确定',
        cancelText: options?.cancelText || '取消',
        confirmColor: options?.confirmColor || '#007AFF',
        cancelColor: options?.cancelColor || '#000000',
        success: (res) => {
          resolve(res.confirm)
        },
        fail: () => {
          resolve(false)
        }
      })
    })
  }

  // 警告对话框
  static alert(
    content: string, 
    title: string = '提示',
    confirmText: string = '确定'
  ): Promise<void> {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        showCancel: false,
        confirmText,
        success: () => {
          resolve()
        },
        fail: () => {
          resolve()
        }
      })
    })
  }
}

// 操作菜单
export class ActionSheet {
  static show(
    itemList: string[],
    options?: {
      title?: string
      alertText?: string
      itemColor?: string
    }
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      uni.showActionSheet({
        itemList,
        title: options?.title,
        alertText: options?.alertText,
        itemColor: options?.itemColor || '#000000',
        success: (res) => {
          resolve(res.tapIndex)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

// 统一导出
export default {
  Toast,
  Modal,
  ActionSheet,
  // 简化调用
  success: Toast.success,
  error: Toast.error,
  loading: Toast.loading,
  hideLoading: Toast.hideLoading,
  show: Toast.show,
  warning: Toast.warning,
  info: Toast.info,
  hide: Toast.hide,
  confirm: Modal.confirm,
  alert: Modal.alert,
  actionSheet: ActionSheet.show
}