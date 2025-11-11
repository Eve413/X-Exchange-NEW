import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationApi } from '@/api'

export interface NotificationItem {
  id: string
  type: 'order' | 'deposit' | 'withdraw' | 'security' | 'system' | 'price_alert'
  title: string
  content: string
  data?: any
  isRead: boolean
  createTime: number
}

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref<NotificationItem[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)

  // 计算属性
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.isRead)
  })

  const readNotifications = computed(() => {
    return notifications.value.filter(n => n.isRead)
  })

  const hasUnread = computed(() => {
    return unreadCount.value > 0
  })

  // 方法
  const fetchNotifications = async (params?: {
    page?: number
    pageSize?: number
    type?: string
    isRead?: boolean
  }) => {
    loading.value = true
    try {
      const response = await notificationApi.getList(params)
      
      if (params?.page && params.page > 1) {
        // 分页加载，追加数据
        notifications.value.push(...response.data.list)
      } else {
        // 首次加载或刷新
        notifications.value = response.data.list
      }
      
      unreadCount.value = response.data.unreadCount
    } catch (error) {
      console.error('获取通知失败:', error)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id)
      
      // 更新本地状态
      const notification = notifications.value.find(n => n.id === id)
      if (notification && !notification.isRead) {
        notification.isRead = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {
      console.error('标记通知已读失败:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      
      // 更新本地状态
      notifications.value.forEach(n => {
        n.isRead = true
      })
      unreadCount.value = 0
    } catch (error) {
      console.error('标记所有通知已读失败:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await notificationApi.delete(id)
      
      // 从本地状态中移除
      const index = notifications.value.findIndex(n => n.id === id)
      if (index > -1) {
        const notification = notifications.value[index]
        if (!notification.isRead) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        notifications.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除通知失败:', error)
    }
  }

  const clearAllNotifications = async () => {
    try {
      await notificationApi.clear()
      
      // 清空本地状态
      notifications.value = []
      unreadCount.value = 0
    } catch (error) {
      console.error('清空通知失败:', error)
    }
  }

  const addNotification = (notification: NotificationItem) => {
    // WebSocket或其他方式接收到新通知时调用
    notifications.value.unshift(notification)
    if (!notification.isRead) {
      unreadCount.value++
    }
  }

  const updateUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount()
      unreadCount.value = response.data.count
    } catch (error) {
      console.error('获取未读通知数失败:', error)
    }
  }

  // 根据类型过滤通知
  const getNotificationsByType = (type: NotificationItem['type']) => {
    return notifications.value.filter(n => n.type === type)
  }

  return {
    // 状态
    notifications,
    unreadCount,
    loading,
    
    // 计算属性
    unreadNotifications,
    readNotifications,
    hasUnread,
    
    // 方法
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    updateUnreadCount,
    getNotificationsByType
  }
}, {
  persist: {
    key: 'notification-store',
    paths: ['notifications', 'unreadCount']
  }
})

export default useNotificationStore
