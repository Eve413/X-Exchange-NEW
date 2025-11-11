<template>
  <view class="newlisting-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <image src="/static/icons/ic_arrow_left.png" mode="aspectFit" class="back-icon" />
      </view>
      <text class="page-title">{{ t('newlisting.title') }}</text>
      <view class="header-actions">
        <image src="/static/icons/refresh.png" mode="aspectFit" class="refresh-icon" @click="refreshData" />
      </view>
    </view>

    <!-- 页面主体内容 -->
    <scroll-view class="content" scroll-y>
      <!-- 页面描述 -->
      <view class="page-description">
        <text class="description-text">{{ t('newlisting.description') }}</text>
        <image src="/static/icons/rechargeImg.png" mode="aspectFit" class="gift-icon" />
      </view>

      <!-- 统计数据 -->
      <view class="stats-section">
        <view class="stat-item">
          <text class="stat-label">{{ t('newlisting.total_projects') }}</text>
          <text class="stat-value">1.21M</text>
        </view>
        <!-- <view class="stat-divider"></view> -->
        <view class="stat-item">
          <text class="stat-label">{{ t('newlisting.total_users') }}</text>
          <text class="stat-value">47,894</text>
        </view>
      </view>

      <!-- 标签页切换 -->
      <view class="tabs-section">
        <view v-for="(tab, index) in tabs" :key="tab.key" :class="['tab-item', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)">
          <view class="tab-text">{{ tab.label }}</view>
          <view class="tab-count">({{ tab.count }})</view>
        </view>
      </view>

      <!-- 项目列表 -->
      <view class="projects-section">
        <view v-for="project in projectList" :key="project.id" class="project-card">
          <!-- 项目头部 -->
          <view class="project-header">
            <image :src="project.icon" mode="aspectFit" class="project-icon" />
            <text class="project-name">{{ project.name }}</text>
            <view :class="['project-status', getStatusClass(project.status)]">
              <text class="status-text">{{ getStatusText(project.status) }}</text>
            </view>
          </view>

          <!-- 项目描述 -->
          <view class="project-description">{{ project.description }}</view>

          <!-- 项目链接 -->
          <view class="project-links">
            <view class="link-item" @click="goToWebsite(project.website)">
              <!-- <image src="/static/icons/website.png" mode="aspectFit" class="link-icon" /> -->
              <text class="link-text">{{ t('newlisting.official_website') }}</text>
            </view>
            <view class="link-item" @click="viewRules(project.id)">
              <!-- <image src="/static/icons/rules.png" mode="aspectFit" class="link-icon" /> -->
              <text class="link-text">{{ t('newlisting.rules') }}</text>
            </view>
            <view class="link-item" @click="viewListingAnnouncement(project.id)">
              <!-- <image src="/static/icons/announcement.png" mode="aspectFit" class="link-icon" /> -->
              <text class="link-text">{{ t('newlisting.listing_announcement') }}</text>
            </view>
          </view>

          <!-- 分发信息 -->
          <view class="distribution-info">
            <text class="info-label">{{ t('newlisting.total_distribution') }}</text>
            <text class="info-value">{{ project.totalDistribution }}</text>
          </view>
          <text class="time-info">{{ project.timeRange }}</text>

          <!-- 投入信息 -->
          <view class="investment-info">
            <view class="invest-header">
              <image src="/static/icons/invest.png" mode="aspectFit" class="invest-icon" />
              <text class="invest-label">{{ t('newlisting.invest_in', { coin: project.investCoin }) }}</text>
            </view>
            <text class="invest-subtitle">{{ t('newlisting.invest_coin', { coin: project.investCoin }) }}</text>


            <!-- 投资详情 -->
            <view class="investment-details">
              <view class="detail-item">
                <text class="detail-label">{{ t('newlisting.purchase_price') }}</text>
                <text class="detail-value">{{ project.purchasePrice }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">{{ t('newlisting.distribution_amount') }}</text>
                <text class="detail-value">{{ project.distributionAmount }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">{{ t('newlisting.participants') }}</text>
                <text class="detail-value">{{ project.participants }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">{{ t('newlisting.total_investment') }}</text>
                <text class="detail-value">{{ project.totalInvestment }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">{{ t('newlisting.funding_target') }}</text>
                <text class="detail-value target-achieved">0 USDT</text>
              </view>
            </view>
          </view>

          <!-- 查看详情按钮 -->
          <view class="action-button" @click="viewProjectDetail(project.id)">
            <text class="button-text">{{ t('newlisting.view_details') }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { tl } from '@/utils/i18n';

const t = tl;

// 标签页数据
const tabs = ref([
  { key: 'ongoing', label: t('newlisting.tab_ongoing'), count: 2 },
  { key: 'upcoming', label: t('newlisting.tab_upcoming'), count: 1 },
  { key: 'past', label: t('newlisting.tab_past'), count: 2 },
  { key: 'airdrop', label: t('newlisting.tab_airdrop'), count: 1 }
]);

const activeTab = ref('past');

// 假数据集合
const mockData = {
  ongoing: [
    {
      id: 1,
      name: 'ABC Token',
      icon: '/static/icons/ic_new.png',
      status: 'ongoing',
      description: 'ABC Token是一个创新的区块链项目，致力于打造去中心化金融生态系统，为用户提供安全、高效的金融服务。',
      website: 'https://www.abctoken.com',
      totalDistribution: '50,000,000 ABC',
      timeRange: '2024-07-10 14:00 ~ 2024-07-15 14:00(UTC+8)',
      investCoin: 'USDT',
      purchasePrice: '1ABC = 0.05 USDT',
      distributionAmount: '25,000,000 ABC',
      participants: '15,321',
      totalInvestment: '1,265,432 USDT'
    },
    {
      id: 2,
      name: 'XYZ Coin',
      icon: '/static/icons/news.png',
      status: 'ongoing',
      description: 'XYZ Coin是基于Layer2技术的高性能公链，专注于解决现有区块链的扩展性问题，支持每秒处理上万笔交易。',
      website: 'https://www.xyzcoin.io',
      totalDistribution: '100,000,000 XYZ',
      timeRange: '2024-07-08 10:00 ~ 2024-07-13 10:00(UTC+8)',
      investCoin: 'USDT',
      purchasePrice: '1XYZ = 0.025 USDT',
      distributionAmount: '40,000,000 XYZ',
      participants: '28,765',
      totalInvestment: '1,058,923 USDT'
    }
  ],
  upcoming: [
    {
      id: 3,
      name: 'DEF Protocol',
      icon: '/static/icons/star.png',
      status: 'upcoming',
      description: 'DEF Protocol是新一代跨链互操作协议，旨在连接不同区块链网络，实现资产无缝转移和数据共享。',
      website: 'https://www.defprotocol.com',
      totalDistribution: '20,000,000 DEF',
      timeRange: '2024-07-20 16:00 ~ 2024-07-25 16:00(UTC+8)',
      investCoin: 'BTC',
      purchasePrice: '1DEF = 0.000005 BTC',
      distributionAmount: '10,000,000 DEF',
      participants: '0',
      totalInvestment: '0 BTC'
    }
  ],
  past: [
    {
      id: 4,
      name: 'BWB',
      icon: '/static/icons/ic_gmail.png',
      status: 'ended',
      description: 'BitgetWallet作为全球领先的一站式交易加密钱包，集合了钱包 Swap 交易、NFT市场、DApp浏览器等多种功能。',
      website: 'https://www.bitget.com',
      totalDistribution: '10,000,000 BWB',
      timeRange: '2024-06-01 11:00 ~ 2024-06-06 16:00(UTC+8)',
      investCoin: 'BGB',
      purchasePrice: '1BWB = 0.10828204BGB',
      distributionAmount: '5,000,000 BWB',
      participants: '20,603',
      totalInvestment: '80,828,403.98 BGB'
    },
    {
      id: 5,
      name: 'GHI Network',
      icon: '/static/icons/link.png',
      status: 'ended',
      description: 'GHI Network是专注于去中心化身份验证的区块链项目，为用户提供安全、隐私的数字身份解决方案。',
      website: 'https://www.ghinetwork.org',
      totalDistribution: '30,000,000 GHI',
      timeRange: '2024-05-15 09:00 ~ 2024-05-20 09:00(UTC+8)',
      investCoin: 'ETH',
      purchasePrice: '1GHI = 0.0002 ETH',
      distributionAmount: '15,000,000 GHI',
      participants: '12,345',
      totalInvestment: '3,012.5 ETH'
    }
  ],
  airdrop: [
    {
      id: 6,
      name: 'JKL Token',
      icon: '/static/icons/share.png',
      status: 'airdropping',
      description: 'JKL Token是专注于社交网络的区块链项目，通过代币激励机制促进优质内容创作和社区建设。',
      website: 'https://www.jkltoken.com',
      totalDistribution: '100,000,000 JKL',
      timeRange: '2024-07-01 00:00 ~ 2024-07-31 23:59(UTC+8)',
      investCoin: 'Free',
      purchasePrice: 'Airdrop',
      distributionAmount: '20,000,000 JKL',
      participants: '45,678',
      totalInvestment: '0'
    }
  ]
};

// 项目列表数据
const projectList = ref([]);

// 根据状态获取样式类名
const getStatusClass = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'status-ongoing';
    case 'upcoming':
      return 'status-upcoming';
    case 'ended':
      return 'status-ended';
    case 'airdropping':
      return 'status-airdropping';
    default:
      return '';
  }
};

// 根据状态获取文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'ongoing':
      return t('newlisting.status_ongoing');
    case 'upcoming':
      return t('newlisting.status_upcoming');
    case 'ended':
      return t('newlisting.status_ended');
    case 'airdropping':
      return t('newlisting.status_airdropping');
    default:
      return '';
  }
};

// 加载指定标签页的数据
const loadTabData = (tabKey: string) => {
  // 根据标签页键名获取对应的数据
  projectList.value = mockData[tabKey] || [];
};

// 切换标签页
const switchTab = (tabKey: string) => {
  activeTab.value = tabKey;
  loadTabData(tabKey);
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 刷新数据
const refreshData = () => {
  // 模拟刷新操作
  console.log('刷新数据');
  // 重新加载当前标签页的数据
  loadTabData(activeTab.value);
};

// 跳转到官网
const goToWebsite = (url: string) => {
  uni.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(url)}`
  });
};

// 查看规则
const viewRules = (projectId: number) => {
  console.log('查看项目规则:', projectId);
};

// 查看上市公告
const viewListingAnnouncement = (projectId: number) => {
  console.log('查看上市公告:', projectId);
};

// 查看项目详情
const viewProjectDetail = (projectId: number) => {
  uni.navigateTo({
    url: `/pages/wealth/newlisting-detail?id=${projectId}`
  });
};

// 组件挂载时初始化数据
onMounted(() => {
  loadTabData(activeTab.value);
});
</script>

<style lang="scss" scoped>
.newlisting-page {
  background-color: #202020;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  background-color: #202020;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 30rpx;
  padding-top: 50rpx;
  box-sizing: content-box;
}

.back-button {
  width: 100rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.header-actions {
  width: 100rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.refresh-icon {
  width: 40rpx;
  height: 40rpx;
}

.content {
  padding-top: 120rpx;
  padding-bottom: 40rpx;
}

.page-description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50rpx 50rpx 30rpx;
  position: relative;
}

.description-text {
  font-size: 28rpx;
  color: #fff;
  max-width: 70%;
  font-weight: 500;
}

.gift-icon {
  width: 200rpx;
  height: 200rpx;
  position: absolute;
  right: 40rpx;
  top: 150rpx;
  transform: translateY(-50%);
}

.stats-section {
  display: flex;
  background-color: #1F1F1F;
  margin: 0 30rpx;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
}

.stat-item {
  // flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 60rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-bottom: 10rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.stat-divider {
  width: 2rpx;
  background-color: #374151;
  margin: 0 30rpx;
}

.tabs-section {
  display: flex;
  justify-content: space-between;
  // margin: 40rpx 0;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
  background-color: #202020;
}

.tab-item {
  flex: 1;
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #9CA3AF;
  // padding: 20rpx 0;
  // position: relative;
}

.tab-item.active {
  color: #8B5CF6;
}

.tab-text {
  font-size: 28rpx;
  // color: #9CA3AF;
}

.tab-item.active {
  color: #fff;
  font-weight: 600;
}

.tab-count {
  font-size: 28rpx;
  // color: #6B7280;
  // margin-top: 4rpx;
}

// .tab-item.active::after {
//   content: '';
//   position: absolute;
//   bottom: 0;
//   width: 40rpx;
//   height: 4rpx;
//   background-color: #8B5CF6;
//   border-radius: 2rpx;
// }

.projects-section {
  padding: 0 30rpx;
}

.project-card {
  background-color: #2A2A2A;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  margin-top: 40rpx;
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20rpx;
}

.project-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  margin-right: 16rpx;
}

.project-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  // flex: 1;
}

.project-status {
  padding: 2rpx 16rpx;
  border-radius: 12rpx;
  margin-left: 20rpx;
}

.project-status.status-ongoing {
  background-color: #3B5A99;
}

.project-status.status-upcoming {
  background-color: #335933;
}

.project-status.status-ended {
  background-color: #333F59;
}

.project-status.status-airdropping {
  background-color: #593359;
}

.status-text {
  font-size: 24rpx;
  color: #FFFFFF;
}

.project-description {
  font-size: 26rpx;
  color: #9CA3AF;
  line-height: 40rpx;
  margin-bottom: 24rpx;
  // margin-top: 20rpx;
}

.project-links {
  display: flex;
  margin-bottom: 24rpx;
}

.link-item {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.link-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
}

.link-text {
  font-size: 22rpx;
  // color: #60A5FA;
  color: #fff;
  padding: 4rpx 12rpx;
  background-color: #333F59;
  border-radius: 10rpx;
}

.distribution-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.info-label {
  font-size: 26rpx;
  color: #9CA3AF;
}

.info-value {
  font-size: 26rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.time-info {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-bottom: 24rpx;
}

.investment-info {
  background-color: #3B3B3B;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  margin-top: 20rpx;
}

.invest-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.invest-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
}

.invest-label {
  font-size: 26rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.invest-subtitle {
  font-size: 24rpx;
  color: #9CA3AF;
}

.investment-details {
  margin-bottom: 24rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.detail-label {
  font-size: 24rpx;
  color: #9CA3AF;
}

.detail-value {
  font-size: 26rpx;
  color: #FFFFFF;
}

.target-achieved {
  color: #19AF00;
}

.action-button {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  border-radius: 12rpx;
  padding: 24rpx 0;
  text-align: center;
}

.button-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}
</style>