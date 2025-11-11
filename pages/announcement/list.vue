<template>
  <view class="announcement-list">
    <view class="header">
      <text class="title">系统公告</text>
    </view>

    <view class="filter-tabs">
      <view class="tab-item" :class="{ active: activeTab === tab.key }" v-for="tab in tabs" :key="tab.key"
        @click="switchTab(tab.key)">
        {{ tab.name }}
      </view>
    </view>

    <view class="announcement-list-content">
      <view class="announcement-item" v-for="item in filteredAnnouncements" :key="item.id" @click="viewDetail(item)">
        <view class="item-header">
          <view class="item-left">
            <text class="item-type" :class="item.type">{{ getTypeText(item.type) }}</text>
            <text class="item-title">{{ item.title }}</text>
          </view>
          <text class="item-time">{{ formatTime(item.publishTime) }}</text>
        </view>

        <text class="item-summary">{{ item.summary }}</text>

        <view class="item-footer" v-if="item.isImportant">
          <text class="important-tag">重要</text>
        </view>
      </view>
    </view>

    <view class="load-more" v-if="hasMore" @click="loadMore">
      <text>加载更多</text>
    </view>

    <view class="empty" v-if="filteredAnnouncements.length === 0">
      <text>暂无公告</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Announcement {
  id: string
  type: 'system' | 'trading' | 'maintenance' | 'feature'
  title: string
  summary: string
  content: string
  publishTime: string
  isImportant: boolean
}

const activeTab = ref('all')
const hasMore = ref(true)

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'system', name: '系统' },
  { key: 'trading', name: '交易' },
  { key: 'maintenance', name: '维护' },
  { key: 'feature', name: '新功能' }
]

const announcements = ref<Announcement[]>([
  {
    id: '1',
    type: 'system',
    title: '系统升级维护通知',
    summary: '为了提升系统性能和用户体验，我们将于2025年9月28日进行系统维护升级...',
    content: '详细内容...',
    publishTime: '2025-09-27 10:00:00',
    isImportant: true
  },
  {
    id: '2',
    type: 'trading',
    title: '新增交易对上线公告',
    summary: 'X交易所将于2025年9月28日12:00正式上线DOGE/USDT交易对...',
    content: '详细内容...',
    publishTime: '2025-09-27 09:30:00',
    isImportant: false
  },
  {
    id: '3',
    type: 'feature',
    title: '移动端App新功能发布',
    summary: '本次更新新增了价格预警、交易统计等功能，欢迎体验...',
    content: '详细内容...',
    publishTime: '2025-09-26 16:20:00',
    isImportant: false
  },
  {
    id: '4',
    type: 'maintenance',
    title: '定期安全维护完成',
    summary: '系统安全维护已于2025年9月26日凌晨顺利完成，所有功能已恢复正常...',
    content: '详细内容...',
    publishTime: '2025-09-26 08:00:00',
    isImportant: false
  }
])

const filteredAnnouncements = computed(() => {
  if (activeTab.value === 'all') return announcements.value
  return announcements.value.filter(item => item.type === activeTab.value)
})

const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
}

const getTypeText = (type: string) => {
  const typeMap: { [key: string]: string } = {
    system: '系统',
    trading: '交易',
    maintenance: '维护',
    feature: '新功能'
  }
  return typeMap[type] || type
}

const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 30) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

const viewDetail = (item: Announcement) => {
  uni.navigateTo({
    url: `/pages/announcement/detail?id=${item.id}`
  })
}

const loadMore = () => {
  uni.showToast({
    title: '加载中...',
    icon: 'loading'
  })
  
  setTimeout(() => {
    hasMore.value = false
    uni.showToast({
      title: '没有更多数据',
      icon: 'none'
    })
  }, 1000)
}
</script>

<style lang="scss" scoped>
.announcement-list {
  padding: 32upx;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 32upx;

  .title {
    font-size: 36upx;
    font-weight: bold;
  }
}

.filter-tabs {
  display: flex;
  margin-bottom: 32upx;
  background: white;
  border-radius: 16upx;
  padding: 8upx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 16upx 0;
    font-size: 28upx;
    color: #666;
    border-radius: 12upx;

    &.active {
      color: #1976d2;
      background: #e3f2fd;
    }
  }
}

.announcement-list-content {
  .announcement-item {
    margin-bottom: 24upx;
    padding: 32upx;
    background: white;
    border-radius: 16upx;

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16upx;

      .item-left {
        flex: 1;

        .item-type {
          display: inline-block;
          padding: 4upx 12upx;
          font-size: 20upx;
          border-radius: 6upx;
          margin-right: 16upx;
          margin-bottom: 8upx;

          &.system {
            background: #e3f2fd;
            color: #1976d2;
          }

          &.trading {
            background: #e8f5e8;
            color: #4caf50;
          }

          &.maintenance {
            background: #fff3e0;
            color: #ff9800;
          }

          &.feature {
            background: #f3e5f5;
            color: #9c27b0;
          }
        }

        .item-title {
          display: block;
          font-size: 32upx;
          font-weight: 500;
          color: #333;
          line-height: 1.4;
        }
      }

      .item-time {
        font-size: 24upx;
        color: #999;
      }
    }

    .item-summary {
      display: block;
      font-size: 28upx;
      color: #666;
      line-height: 1.5;
      margin-bottom: 16upx;
    }

    .item-footer {
      display: flex;
      justify-content: flex-end;

      .important-tag {
        padding: 4upx 12upx;
        background: #ffebee;
        color: #f44336;
        font-size: 20upx;
        border-radius: 6upx;
      }
    }
  }
}

.load-more {
  text-align: center;
  padding: 32upx 0;
  color: #666;
  font-size: 28upx;
}

.empty {
  text-align: center;
  padding: 100upx 0;
  color: #999;
  font-size: 28upx;
}
</style>
