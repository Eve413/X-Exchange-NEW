<template>
  <view class="airdrop-page">
    <!-- 顶部安全区 -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>

    <!-- 头部导航栏 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="back-arrow">
          <image class="back-arrow-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
        </text>
      </view>
      <text class="page-title">{{ t('airdrop.title') }}</text>
      <view class="header-actions">
        <image class="refresh-icon" src="/static/icons/ic_headphone.png" mode="aspectFit" @click="refreshData" />
        <image class="notification-icon" src="/static/icons/ic_bell.png" mode="aspectFit" @click="goToNotification" />
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 空投总览区域 -->
      <view class="overview-section">
        <text class="overview-title">{{ t('airdrop.complete_tasks') }}</text>
        <view class="stats-container">
          <view class="stat-item">
            <text class="stat-label">{{ t('airdrop.total_airdrop_usdt') }}</text>
            <text class="stat-value">{{ overviewStats.totalAirdrop }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">{{ t('airdrop.total_participants') }}</text>
            <text class="stat-value">{{ overviewStats.participants }}</text>
          </view>
        </view>
        <image class="treasure-icon" src="/static/icons/airpotIcon.png" mode="aspectFit" />
      </view>

      <!-- 标签切换 -->
      <view class="tabs-section">
        <view v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
          @click="switchTab(tab.key)">
          <text class="tab-text">{{ tab.label }}({{ tab.count }})</text>
        </view>
      </view>

      <!-- 空投列表 -->
      <view class="airdrop-list">
        <view v-for="item in airdropList" :key="item.id" class="airdrop-card">
          <!-- 卡片头部 -->
          <view class="card-header">
            <image class="airdrop-logo" :src="item.logo" mode="aspectFit" />
            <text class="airdrop-name">{{ item.name }}</text>
            <view class="tag-container" v-if="item.tag">
              <text class="tag-text">{{ item.tag }}</text>
            </view>
          </view>

          <!-- 卡片内容 -->
          <view class="card-content">
            <view class="airdrop-title">{{ t('airdrop.total_airdrop') }}</view>
            <view class="airdrop-amount">{{ item.totalAirdrop }}</view>
            <view class="airdrop-value">(≈{{ item.conversionRate }})</view>

            <view class="stats-row">
              <text class="stat-label">{{ t('airdrop.participants') }}</text>
              <text class="stat-value">{{ item.participants }}</text>
            </view>

            <view class="stats-row">
              <text class="stat-label">{{ t('airdrop.ending_in') }}</text>
              <text class="countdown-text">{{ item.countdown }}</text>
            </view>
          </view>

          <!-- 任务信息 -->
          <view class="task-info" v-if="item.taskInfo">
            <text class="task-text">{{ item.taskInfo }}</text>
            <!-- <image class="share-icon" src="/static/icons/share.png" mode="aspectFit" @click="shareAirdrop(item.id)" /> -->
          </view>

          <!-- 底部按钮 -->
          <view class="card-footer">
            <view class="join-button" @click="joinAirdrop(item.id)">
              <text class="join-text">{{ t('airdrop.join') }}</text>
            </view>

          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { tl } from "@/utils/i18n";
import { useSafeArea } from "@/utils/composables/useSafeArea";

const { getTopStyle } = useSafeArea();
const t = tl;

// 顶部导航相关
const goBack = () => {
  uni.navigateBack();
};

const refreshData = () => {
  console.log('刷新数据');
  // 这里可以实现数据刷新逻辑
};

const goToNotification = () => {
  uni.navigateTo({
    url: "/pages/notification/index",
    success: () => console.log("✅ 跳转到通知页面成功"),
    fail: (err) => console.error("❌ 跳转到通知页面失败:", err),
  });
};

// 标签切换
const activeTab = ref('ongoing');
const tabs = [
  { key: 'ongoing', label: t('airdrop.ongoing'), count: 2 },
  { key: 'upcoming', label: t('airdrop.upcoming'), count: 0 },
  { key: 'past', label: t('airdrop.past'), count: 0 },
  { key: 'airdropping', label: t('airdrop.airdropping'), count: 0 },
];

const switchTab = (tabKey: string) => {
  activeTab.value = tabKey;
  console.log('切换到标签:', tabKey);
  // 这里可以根据标签加载不同的数据
};

// 总览数据
const overviewStats = {
  totalAirdrop: '1.21M',
  participants: '47,894'
};

// 空投列表数据
const airdropList = [
  {
    id: 1,
    name: 'PAWS',
    logo: '/static/icons/giftDark.png',
    rewardLabel: t('airdrop.bonus_reward'),
    tag: '',
    totalAirdrop: '500,000 PROMPT',
    conversionRate: '246,565 USD',
    participants: '2,371',
    countdown: '04D:15H:23M:11S',
    taskInfo: t('airdrop.trading_task_info')
  },
  {
    id: 2,
    name: 'PAWS',
    logo: '/static/icons/giftDark.png',
    rewardLabel: t('airdrop.bonus_reward'),
    tag: t('airdrop.new_user'),
    totalAirdrop: '500,000 PROMPT',
    conversionRate: '246,565 USD',
    participants: '2,371',
    countdown: '04D:15H:23M:11S',
    taskInfo: t('airdrop.trading_task_info')
  }
];

// 加入空投
const joinAirdrop = (airdropId: number) => {
  console.log('加入空投:', airdropId);
  // 跳转到空投活动详情页面
  uni.navigateTo({
    url: `/pages/airdrop/detail?id=${airdropId}`,
    success: () => console.log("✅ 跳转到空投活动详情页面成功"),
    fail: (err) => console.error("❌ 跳转到空投活动详情页面失败:", err),
  });
};

// 分享空投
const shareAirdrop = (airdropId: number) => {
  console.log('分享空投:', airdropId);
  // 这里可以实现分享功能
};
</script>

<style lang="scss" scoped>
.airdrop-page {
  min-height: 100vh;
  background: #202020;
  color: #ffffff;
}

// 头部样式
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background: #202020;
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: 60rpx;
  // border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.back-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-arrow {
  font-size: 44rpx;
  color: #ffffff;
}

.back-arrow-icon {
  width: 40rpx;
  height: 32rpx;
}

.page-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.refresh-icon,
.notification-icon {
  width: 44rpx;
  height: 44rpx;
  opacity: 0.8;
}

// 内容滚动区域
.content-scroll {
  height: calc(100vh - 120rpx);
}

// 总览区域
.overview-section {
  padding: 32rpx 32rpx 0;
  // background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
  position: relative;
  border-radius: 0 0 32rpx 32rpx;
  // margin-bottom: 32rpx;
}

.overview-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 24rpx;
  display: block;
}

.stats-container {
  display: flex;
  justify-content: flex-start;
  gap: 48rpx;
  margin-bottom: 24rpx;

}

.stat-item {
  margin-right: 50rpx;
  // flex: 1;
}

.stat-label {
  font-size: 24rpx;
  color: #cccccc;
  display: block;
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  display: block;
}

.treasure-icon {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  width: 200rpx;
  height: 200rpx;
}

// 标签样式
.tabs-section {
  display: flex;
  padding: 0 32rpx;
  margin-bottom: 32rpx;
  gap: 16rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

.tab-item {
  flex: 1;
  padding: 16rpx 0;
  text-align: center;
  color: #9AA4AE;
  // background: #2a2a2a;
  // border-radius: 20rpx;
  // transition: all 0.3s ease;
}

.tab-item.active {
  // background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
}

.tab-text {
  font-size: 28rpx;
  // font-weight: 500;
  // color: #ffffff;
}

// 空投列表
.airdrop-list {
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.airdrop-card {
  background: #2A2A2A;
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

// 卡片头部
.card-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.airdrop-logo {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  // background: white;
  padding: 4rpx;
}

.airdrop-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.tag-container {
  background: rgba(25, 175, 0, 0.12);
  padding: 2rpx 16rpx;
  color: #19AF00;
  border-radius: 12rpx;
}

.tag-text {
  font-size: 20rpx;
  color: #19AF00;
  font-weight: 500;
}

// 卡片内容
.card-content {
  text-align: center;
}

.airdrop-title {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-bottom: 8rpx;
}

.airdrop-amount {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.airdrop-value {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-bottom: 20rpx;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #9AA4AE;
}

.stat-value {
  font-size: 24rpx;
  color: #ffffff;
}

.countdown-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 500;
}

// 任务信息
.task-info {
  // background: rgba(139, 92, 246, 0.1);
  padding: 16rpx;
  border-radius: 16rpx;
}

.task-text {
  font-size: 24rpx;
  color: #ffffff;
}

.task-text text {
  color: #8b5cf6;
}

// 卡片底部
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
  // margin: 8rpx auto 0;
}

.join-button {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  padding: 20rpx 0;
  width: calc(100% - 60rpx);
  border-radius: 16rpx;
  text-align: center;
  margin: 0 auto;
}

.join-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.share-icon {
  width: 44rpx;
  height: 44rpx;
  opacity: 0.8;
}

// 底部占位
.bottom-spacer {
  height: 80rpx;
}
</style>