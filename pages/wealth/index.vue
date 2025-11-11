<template>
  <view class="wealth-page">
    <!-- 顶部安全区 -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>

    <!-- 头部导航栏 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="back-arrow">
          <image class="back-arrow-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="refreshData" />
        </text>
      </view>
      <text class="page-title">{{ t('wealth.title') }}</text>
      <view class="header-actions">
        <image class="refresh-icon" src="/static/icons/ic_headphone.png" mode="aspectFit" @click="refreshData" />
        <image class="notification-icon" src="/static/icons/ic_bell.png" mode="aspectFit" @click="goToNotification" />
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 空投奖励信息 -->
      <view class="airdrop-section">
        <text class="airdrop-title">{{ t('wealth.airdrop_reward_title') }}</text>
        <view class="airdrop-stats">
          <view class="stat-item">
            <text class="stat-label">{{ t('wealth.total_airdrop') }}</text>
            <text class="stat-value">{{ totalAirdrop }}</text>
          </view>
          <!-- <view class="stat-divider"></view> -->
          <view class="stat-item">
            <text class="stat-label">{{ t('wealth.participants') }}</text>
            <text class="stat-value">{{ participantCount }}</text>
          </view>
        </view>
        <view class="airdrop-image">
          <image src="/static/icons/rechargeImg.png" mode="aspectFit" />
        </view>
      </view>

      <!-- 理财产品标签页 -->
      <view class="tabs-section">
        <view class="tabs">
          <view v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
            @click="switchTab(tab.key)">
            <text class="tab-text">{{ tab.label }}</text>
            <view v-if="tab.count > 0" class="tab-badge">({{ tab.count }})</view>
          </view>
        </view>
      </view>

      <!-- 理财产品列表 -->
      <view class="products-section">
        <view v-for="(product, index) in productList" :key="product.id" class="product-card"
          :class="{ 'first-card': index === 0 }" @click="goToProductDetail(product.id)">
          <view class="product-header">
            <view class="product-info">
              <image class="product-icon" :src="product.icon" mode="aspectFit" />
              <text class="product-name">{{ product.name }}</text>
              <image v-if="product.isHot" class="hot-icon" src="/static/icons/hot.png" mode="aspectFit" />
            </view>
            <view class="product-tags">
              <view v-if="product.tags" class="tag-item" :class="product.tagClass">
                <text class="tag-text">{{ product.tags }}</text>
              </view>
            </view>
          </view>

          <view class="product-rates">
            <view class="rate-item">
              <text class="rate-label">{{ t('wealth.regular_apr') }}</text>
              <text class="rate-value">{{ product.regularApr }}%</text>
            </view>
            <view class="rate-item">
              <text class="rate-label">{{ t('wealth.seven_day_rate') }}</text>
              <text class="rate-value">{{ product.sevenDayRate }}%</text>
            </view>
            <view class="rate-item">
              <text class="rate-label">{{ t('wealth.thirty_day_rate') }}</text>
              <text class="rate-value">{{ product.thirtyDayRate }}%</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { tl } from "@/utils/i18n";
import { useSafeArea } from "@/utils/composables/useSafeArea";

const { getTopStyle } = useSafeArea();
const t = tl;

// 模拟数据
const totalAirdrop = "1.21M USDT";
const participantCount = "47,894";

// 标签页数据
const activeTab = ref('ongoing');
const tabs = [
  { key: 'ongoing', label: t('wealth.ongoing'), count: 3 },
  { key: 'upcoming', label: t('wealth.upcoming'), count: 2 },
  { key: 'past', label: t('wealth.past'), count: 2 },
  { key: 'airdropping', label: t('wealth.airdropping'), count: 1 }
];

// 产品列表数据
const productList = ref([]);

// 不同标签页的假数据
const tabData = {
  ongoing: [
    {
      id: 1,
      name: 'BTC',
      icon: '/static/logo/logos_bitcoin.png',
      isHot: true,
      tags: t('wealth.hot_recommended'),
      tagClass: 'hot-tag',
      regularApr: '4.37',
      sevenDayRate: '4.37',
      thirtyDayRate: '4.37'
    },
    {
      id: 2,
      name: 'USDT',
      icon: '/static/tubiao/bizhong/usdt.png',
      isHot: true,
      tags: t('wealth.hot_recommended'),
      tagClass: 'hot-tag',
      regularApr: '3.25',
      sevenDayRate: '3.21',
      thirtyDayRate: '3.18'
    },
    {
      id: 3,
      name: 'ETH',
      icon: '/static/logo/logos_ethereum.png',
      isHot: false,
      tags: t('wealth.stable_yield'),
      tagClass: 'stable-tag',
      regularApr: '3.85',
      sevenDayRate: '3.82',
      thirtyDayRate: '3.79'
    }
  ],
  upcoming: [
    {
      id: 101,
      name: 'SOL',
      icon: '/static/tubiao/bizhong/sol.png',
      isHot: false,
      tags: t('wealth.coming_soon'),
      tagClass: 'coming-tag',
      regularApr: '5.20',
      sevenDayRate: '0.00',
      thirtyDayRate: '0.00'
    },
    {
      id: 102,
      name: 'AVAX',
      icon: '/static/tubiao/bizhong/avax.png',
      isHot: true,
      tags: t('wealth.hot_upcoming'),
      tagClass: 'upcoming-tag',
      regularApr: '4.95',
      sevenDayRate: '0.00',
      thirtyDayRate: '0.00'
    }
  ],
  past: [
    {
      id: 201,
      name: 'DOT',
      icon: '/static/tubiao/bizhong/dot.png',
      isHot: false,
      tags: t('wealth.ended'),
      tagClass: 'ended-tag',
      regularApr: '4.50',
      sevenDayRate: '4.48',
      thirtyDayRate: '4.45'
    },
    {
      id: 202,
      name: 'ADA',
      icon: '/static/tubiao/bizhong/ada.png',
      isHot: false,
      tags: t('wealth.ended'),
      tagClass: 'ended-tag',
      regularApr: '3.90',
      sevenDayRate: '3.88',
      thirtyDayRate: '3.85'
    }
  ],
  airdropping: [
    {
      id: 301,
      name: 'ARB',
      icon: '/static/tubiao/bizhong/arb.png',
      isHot: true,
      tags: t('wealth.airdropping_now'),
      tagClass: 'airdrop-tag',
      regularApr: '6.50',
      sevenDayRate: '6.48',
      thirtyDayRate: '6.45'
    }
  ]
};

// 初始化加载默认标签页数据
const loadTabData = (tabKey) => {
  productList.value = tabData[tabKey] || [];
};

// 初始化时加载ongoing标签的数据
loadTabData('ongoing');

// 切换标签页
const switchTab = (tabKey: string) => {
  activeTab.value = tabKey;
  // 加载对应标签页的数据
  loadTabData(tabKey);
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 刷新数据
const refreshData = () => {
  console.log('刷新数据');
  // 这里可以添加刷新逻辑
};

// 跳转到通知页面
const goToNotification = () => {
  uni.navigateTo({
    url: '/pages/notification/index'
  });
};

// 跳转到产品详情页面
const goToProductDetail = (productId: number) => {
  try {
    uni.navigateTo({
      url: `/pages/wealth/detail?id=${productId}`,
      success: () => console.log(`✅ 跳转到产品详情页面成功，产品ID: ${productId}`),
      fail: (err) => console.error('❌ 跳转到产品详情页面失败:', err),
    });
  } catch (error) {
    console.error('跳转到产品详情页面函数执行出错:', error);
  }
};
</script>

<style lang="scss" scoped>
.wealth-page {
  height: 100vh;
  background: #202020;
  color: #ffffff;
  overflow: hidden;
}

// 头部样式
.header {
  display: flex;
  align-items: center;
  padding: 60rpx 32rpx 20rpx;
  background: #202020;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  width: 100rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.back-arrow {
  font-size: 44rpx;
  color: #ffffff;
}
.back-arrow-icon{
  width: 40rpx;
  height: 32rpx;
}
.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 32rpx;
  width: 100rpx;
  justify-content: flex-end;
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

// 空投奖励区域
.airdrop-section {
  margin: 32rpx;
  // padding: 36rpx;
  // background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
  border-radius: 28rpx;
  position: relative;
}

.airdrop-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
  // padding-bottom: 32rpx;
}

.airdrop-stats {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.stat-item {
  // flex: 1;
  margin-right: 50rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #9AA4AE;
  display: block;
  margin-top: 20rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 32rpx;
}

.airdrop-image {
  position: absolute;
  right: 36rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 200rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.airdrop-image image {
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

// 标签页样式
.tabs-section {
  margin: 0 auto 24rpx;
}

.tabs {
  display: flex;
  // background: #2a2a2a;
  // border-radius: 12rpx;
  // padding: 8rpx;
  border-bottom: solid 1rpx rgba(255, 255, 255, 0.12);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 16rpx 0;
  position: relative;
  // border-radius: 8rpx;
  // transition: all 0.3s;
  color: #9AA4AE;
  font-size: 28rpx;
}

.tab-item.active {
  // background: #434343;
  // border-bottom: 2rpx solid #9AA4AE;
}

.tab-text {

  // color: #9AA4AE;
}

.tab-item.active {
  color: #ffffff;
  font-weight: 500;
}

.tab-badge {
  // position: absolute;
  // top: 8rpx;
  // right: 30%;
  // background: #ef4444;
  // color: #ffffff;
  font-size: 28rpx;
  // padding: 2rpx 10rpx;
  // border-radius: 10rpx;
  // min-width: 24rpx;
  text-align: center;
}

// 产品列表样式
.products-section {
  padding: 0 32rpx 40rpx;
}

.product-card {
  background: #2a2a2a;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  // transition: transform 0.2s;
}

.product-card:active {
  transform: scale(0.98);
}

.product-card.first-card {
  margin-top: 8rpx;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.product-icon {
  width: 48rpx;
  height: 48rpx;
}

.product-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.hot-icon {
  width: 36rpx;
  height: 36rpx;
}

.product-tags {
  display: flex;
  gap: 12rpx;
}

.tag-item {
  padding: 4rpx 16rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hot-tag {
  background: rgba(50, 93, 244, 0.12);
}

.stable-tag {
  background: rgba(16, 185, 129, 0.12);
}

.coming-tag {
  background: rgba(245, 158, 11, 0.12);
}

.upcoming-tag {
  background: rgba(245, 158, 11, 0.12);
}

.ended-tag {
  background: rgba(156, 163, 175, 0.12);
}

.airdrop-tag {
  background: rgba(236, 72, 153, 0.12);
}

.tag-text {
  font-size: 20rpx;
  font-weight: 500;
}

.hot-tag .tag-text,
.upcoming-tag .tag-text {
  color: #325DF4;
}

.stable-tag .tag-text {
  color: #10B981;
}

.coming-tag .tag-text {
  color: #F59E0B;
}

.ended-tag .tag-text {
  color: #9CA3AF;
}

.airdrop-tag .tag-text {
  color: #EC4899;
}

// 收益率样式
.product-rates {
  display: flex;
  justify-content: space-between;
}

.rate-item {
  text-align: center;
  flex: 1;
}

.rate-label {
  font-size: 24rpx;
  color: #cccccc;
  display: block;
  margin-bottom: 8rpx;
}

.rate-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}
</style>