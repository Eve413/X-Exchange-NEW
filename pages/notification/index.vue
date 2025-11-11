<template>
  <view class="message-page-dialog">
    <!-- Header (Fixed) -->
    <view class="header-dialog">
      <image src="/static/icons/ic_arrow_left.png" class="back-icon-dialog" @click="goBack" />
      <text class="title-dialog">{{ t('notification.title') }}</text>
    </view>

    <!-- Tabs (Fixed) -->
    <view class="tabs-dialog">
      <text v-for="(tab, index) in tabs" :key="index" class="tab-item-dialog" :class="{ active: activeTab === index }"
        @tap="handleTabChange(index)">
        {{ tab }}
      </text>
    </view>

    <!-- Divider -->
    <view class="divider-dialog"></view>

    <!-- Scrollable Message List -->
    <view class="scroll-container-dialog">
      <scroll-view scroll-y class="message-list-dialog" v-if="messages && messages.length">
        <view v-for="(item, index) in messages" :key="index" class="message-card-dialog">
          <view class="icon-box-dialog">
            <image src="/static/icons/ic_bell.png" class="icon-dialog" />
          </view>
          <view class="message-content-dialog">
            <text class="message-title-dialog">{{ item.title }}</text>
            <text class="message-body-dialog">{{ item.description }}</text>
            <text class="message-time-dialog">{{ item.created }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view scroll-y class="message-empty-page-dialog" v-if="!messages || messages.length === 0">
        <view class="empty-container-dialog">
          <image src="/static/icons/empty_bell.png" class="empty-icon-dialog" mode="aspectFit" />
          <text class="empty-text-dialog">{{ t('notification.empty') }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore, NotificationParams } from '@/store/modules/user'
import { onLoad } from '@dcloudio/uni-app'
const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const tabs = [
  t('notification.tabs.all'),
  t('notification.tabs.system'),
  t('notification.tabs.announcement'),
  t('notification.tabs.activity')
]
const activeTab = ref(0)
// 存储所有原始消息数据
const allMessages = ref([])
// 用于显示的消息数据
const messages = ref([])
  // {
  //   title: 'BiyaPay 就"香港地区无牌"声明的回应',
  //   body: '近日，我们注意到香港证券及期货事务监察委员会（证监会）发布的相关声明。对此，BiyaPay作出如下说明。',
  //   time: '2025-09-25 21:46:55'
  // },
  // {
  //   title: '0%手续费交易就来BiyaPay',
  //   body: '感谢您对BiyaPay的选择与信任。为回馈支持，我们推出手续费池+抽送iPhone 17 Pro Max。',
  //   time: '2025-09-25 21:46:55'
  // },
  // {
  //   title: 'BiyaPay助您合约无忧交易，爆仓包赔！',
  //   body: '合约交易高收益，但新手往往担心风险控制。为让更多用户安心体验合约交易，BiyaPay特别推出"首单爆仓包赔"活动！',
  //   time: '2025-09-25 21:46:55'
  // }

onLoad(async (options) => {
  console.log('options:', options)

  try {
    const notificationParams: NotificationParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: "en"
    }

    const resultBanner = await userStore.getNotification(notificationParams)

    // 保存原始数据到allMessages，并确保是数组类型
    allMessages.value = Array.isArray(resultBanner.data.data) ? resultBanner.data.data : []
    
    // 使用handleTabChange方法来初始化显示数据，确保逻辑一致
    handleTabChange(0)

    console.log("✅ 消息数据加载完成")
  } catch (e) {
    console.error('❌ Failed to load tickers:', e)
    // 发生错误时确保messages是空数组，显示空状态
    messages.value = []
  }
})

function goBack() {
  uni.navigateBack()
}

// 处理tab切换
function handleTabChange(index) {
  activeTab.value = index
  
  // 确保allMessages始终是数组类型，增强安全性
  const safeAllMessages = Array.isArray(allMessages.value) ? allMessages.value : []
  
  // 根据选中的tab更新显示的消息
  if (index === 0) { // 全部消息
    // 直接显示所有消息
    messages.value = [...safeAllMessages]
  } else if (index === 1) { // 系统消息显示空状态
    // 系统消息显示空状态
    messages.value = []
  } else if (index === 2) { // 平台公告
    if (safeAllMessages.length > 0) {
      // 有消息时，添加公告标识
      messages.value = safeAllMessages.map(item => ({
        ...item,
        title: t('notification.announcement_prefix') + item.title,
        description: t('notification.announcement_label') + item.description
      }))
    } else {
      // 无消息时，显示空状态
      messages.value = []
    }
  } else if (index === 3) { // 活动通知
    if (safeAllMessages.length > 0) {
      // 有消息时，只显示部分并添加活动标识
      messages.value = safeAllMessages.slice(0, Math.min(2, safeAllMessages.length)).map(item => ({
        ...item,
        title: t('notification.activity_prefix') + item.title,
        description: t('notification.activity_label') + item.description,
        created: item.created || t('notification.latest_activity')
      }))
    } else {
      // 无消息时，显示空状态
      messages.value = []
    }
  }
}

// 提供一个公共方法，用于在数据更新后刷新当前tab显示的数据
// 当外部或API更新了allMessages后，可以调用此方法刷新显示
function refreshCurrentTabData() {
  handleTabChange(activeTab.value)
}
</script>

<style scoped>
/* Main Container */
.message-page-dialog {
  background-color: #202020;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header - Fixed at top */
.header-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
  height: 100rpx;
  border-bottom: 1rpx solid #202020;
  background-color: #202020;
  flex-shrink: 0;
  padding-top: 40rpx;
  box-sizing: content-box;
}

.back-icon-dialog {
  position: absolute;
  left: 24rpx;
  width: 40rpx;
  height: 36rpx;
}

.title-dialog {
  font-size: 34rpx;
  font-weight: bold;
}

/* Tabs - Fixed below header */
.tabs-dialog {
  display: flex;
  justify-content: space-around;
  position: sticky;
  top: 120rpx; /* Height of header + padding */
  z-index: 10;
  background-color: #202020;
  padding: 20rpx 0;
  flex-shrink: 0;
  overflow: hidden;
}

.tab-item-dialog {
  color: #aaa;
  font-size: 28rpx;
  text-align: center;
}

.tab-item-dialog.active {
  color: #fff;
  font-weight: 600;
  padding-bottom: 6rpx;
}

/* Divider */
.divider-dialog {
  height: 1rpx;
  background-color: #2a2a2a;
  flex-shrink: 0;
}

/* Scroll Container - Takes remaining space */
.scroll-container-dialog {
  flex: 1;
  overflow: hidden;
  background-color: #202020;
}

/* Message List - Scrollable */
.message-list-dialog {
  height: 100%;
  padding:0 24rpx 0rpx;
  background-color: #202020;
}

/* Message Card */
.message-card-dialog {
  display: flex;
  flex-direction: row;
  padding: 24rpx 0;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

.icon-box-dialog {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon-dialog {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.6;
}

.message-content-dialog {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-title-dialog {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10rpx;
}

.message-body-dialog {
  color: #A0A6B9;
  font-size: 26rpx;
  line-height: 1.5;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;        /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30rpx;
}

.message-time-dialog {
  color: #A0A6B9;
  font-size: 22rpx;
}

/* Empty State - Scrollable */
.message-empty-page-dialog {
  height: 100%;
  background-color: #202020;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Container tengah */
.empty-container-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 400rpx;
}

/* Gambar lonceng besar */
.empty-icon-dialog {
  width: 460rpx;
  height: 460rpx;
  margin-bottom: 30rpx;
  opacity: 0.95;
}

/* Teks "暂无消息" */
.empty-text-dialog {
  color: #a6a8ad;
  font-size: 28rpx;
  text-align: center;
}
</style>
