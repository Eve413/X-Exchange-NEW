<template>
  <view class="follow-page">
    <!-- 固定头部区域 -->
    <view class="fixed-header-area">
      <!-- 页面头部 -->
      <view class="header">
        <view class="header-left" @click="goBack">
          <!-- <text class="back-arrow"> -->
          <image class="back-arrow" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
          <!-- </text> -->
        </view>
        <view class="header-center">
          <text class="header-title">{{ t('follow.title') }}</text>
        </view>
        <view class="header-right">
          <view class="notification-wrapper" @click="goToCustomerService">
            <image class="header-icon" src="/static/icons/ic_headphone.png" mode="aspectFit" />
          </view>
          <view class="notification-wrapper" @click="goToNotification">
            <image class="header-icon" src="/static/icons/ic_bell.png" mode="aspectFit" />
            <view class="notification-badge"></view>
          </view>
        </view>
      </view>

      <!-- 申请成为带单员 -->
      <view class="apply-section">
        <view class="apply-left">
          <text class="apply-title">{{ t('follow.applyTrader') }}</text>
          <text class="apply-action" @click="applyTrader">{{ t('follow.viewNow') }}</text>
        </view>
        <image class="apply-image" src="/static/icons/fllowTitleImg.png" mode="aspectFit" />
      </view>

      <!-- 项目筛选 -->
      <view class="filter-section">
        <view class="filter-tabs">
          <text v-for="tab in [t('follow.allProjects'), t('follow.favorites')]" :key="tab" :class="['filter-tab', { active: activeTab === tab }]"
            @click="switchTab(tab)">{{ tab }}</text>
        </view>

        <view class="sort-section">
          <view class="sortList">
            <view class="sort-item">
              <text class="sort-text">{{ t('follow.period30D') }}</text>
              <image class="sort-arrow" src="/static/icons/donwArrow.png" mode="aspectFit" />
            </view>
            <view class="sort-item">
              <text class="sort-text">{{ t('follow.profitLoss') }}</text>
              <image class="sort-arrow" src="/static/icons/donwArrow.png" mode="aspectFit" />
            </view>
          </view>

          <view class="sort-item1">
            <image class="sort-icon" src="/static/icons/TransactionDetails.png" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>

    <!-- 可滚动的带单员列表 -->
    <scroll-view class="trader-list" scroll-y>
      <!-- 带单员卡片 -->
      <template v-if="traderList.length > 0">
        <view v-for="(trader, index) in traderList" :key="trader.id" class="trader-card">
          <!-- 带单员基本信息和操作按钮 -->
          <view class="trader-header">
            <view class="trader-info">
              <image class="trader-avatar" :src="trader.avatar" mode="aspectFit" />
              <view class="trader-name-section">
                <text class="trader-name">TUYJHUI</text>
                <view class="trader-score">
                  <image class="humanIcon" src="/static/icons/humanIcon.png" mode="aspectFit" />
                  <text class="score1">{{ trader.score }}</text>{{ trader.totalScore }}
                </view>
              </view>
            </view>
            <view class="trader-actions">
              <text class="view-details" @click="viewTraderDetails(trader.id)">{{ t('follow.viewDetails') }}</text>
                <text class="follow-btn" @click="followTrader(trader.id)">{{ t('follow.followTrader') }}</text>
            </view>
          </view>

          <!-- 主要统计数据 -->
          <view class="trader-stats-container">
            <view class="profit-left">
              <view class="profit-section">
                <text class="stat-label">{{ t('follow.profit30d') }}</text>
                <text class="stat-value positive large">+24.11</text>
              </view>
              <view class="profit-chart">
                <image class="chart-image" src="/static/icons/line_chart.png" mode="aspectFit" />
              </view>
            </view>

            <view class="trader-detailed-stats">
              <view class="stat-row">
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.returnRate30d') }}</text>
                  <text class="stat-value positive">101.86%</text>
                </view>
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.assetSize') }}</text>
                  <text class="stat-value">2,113,255.27</text>
                </view>
              </view>
              <view class="stat-row">
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.maxDrawdown30d') }}</text>
                  <text class="stat-value negative">63.74%</text>
                </view>
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.sharpeRatio') }}</text>
                  <text class="stat-value">3.45</text>
                </view>
              </view>
            </view>

          </view>


          <!-- 详细统计数据 -->

        </view>

        <!-- 代单引导卡片 -->
        <view class="apply-section-bottom">
          <view class="apply-left">
            <text class="apply-title">{{ t('follow.becomeTraderPrompt') }}</text>
            <text class="apply-action" @click="applyTrader">{{ t('follow.applyNow') }}</text>
          </view>
          <image class="apply-image" src="/static/icons/fllowImg.png" mode="aspectFit" />
        </view>

        <!-- 继续显示剩余的带单员卡片 -->
        <view v-for="(trader, index) in remainingTraders" :key="'remaining-' + trader.id" class="trader-card">
          <!-- 带单员基本信息和操作按钮 -->
          <view class="trader-header">
            <view class="trader-info">
              <image class="trader-avatar" :src="trader.avatar" mode="aspectFit" />
              <view class="trader-name-section">
                <text class="trader-name">TUYJHUI</text>
                <view class="trader-score">
                  <image class="humanIcon" src="/static/icons/humanIcon.png" mode="aspectFit" />
                  <text class="score1">{{ trader.score }}</text>{{ trader.totalScore }}
                </view>
              </view>
            </view>
            <view class="trader-actions">
              <text class="view-details" @click="viewTraderDetails(trader.id)">{{ t('follow.viewDetails') }}</text>
                  <text class="follow-btn" @click="followTrader(trader.id)">{{ t('follow.followTrader') }}</text>
            </view>
          </view>

          <!-- 主要统计数据 -->
          <view class="trader-stats-container">
            <view class="profit-left">
              <view class="profit-section">
                <text class="stat-label">{{ t('follow.profit30d') }}</text>
                <text class="stat-value positive large">+24.11</text>
              </view>
              <view class="profit-chart">
                <image class="chart-image" src="/static/icons/line_chart.png" mode="aspectFit" />
              </view>
            </view>

            <view class="trader-detailed-stats">
              <view class="stat-row">
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.returnRate30d') }}</text>
                  <text class="stat-value positive">101.86%</text>
                </view>
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.assetSize') }}</text>
                  <text class="stat-value">2,113,255.27</text>
                </view>
              </view>
              <view class="stat-row">
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.maxDrawdown30d') }}</text>
                  <text class="stat-value negative">63.74%</text>
                </view>
                <view class="stat-item">
                  <text class="stat-label">{{ t('follow.sharpeRatio') }}</text>
                  <text class="stat-value">3.45</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 详细统计数据 -->

        </view>
      </template>

      <!-- 空状态提示 -->
      <template v-else>
        <view class="empty-state">
          <text class="empty-text">{{ activeTab === t('follow.favorites') ? t('follow.noFavoriteTraders') : t('follow.noTraders') }}</text>
        </view>
      </template>

      <!-- 底部占位 -->
      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storage } from '@/utils/storage'

const { t, locale } = useI18n()

const router = useRouter()

// 当前激活的tab
const activeTab = ref(t('follow.allProjects'))

// 模拟带单员数据
const allTraders = ref([
  {
    id: 1,
    name: 'TUYJHUI',
    avatar: '/static/icons/testAvatar.png',
    score: '8.7',
    totalScore: '/10',
    profit30d: '+24.11',
    rate30d: '101.86%',
    assetSize: '2,113,255.27',
    maxDrawdown: '63.74%',
    sharpeRatio: '3.45',
    isFavorite: true
  },
  {
    id: 2,
    name: 'TUYJHUI',
    avatar: '/static/icons/testAvatar.png',
    score: '8.7',
    totalScore: '/10',
    profit30d: '+24.11',
    rate30d: '101.86%',
    assetSize: '2,113,255.27',
    maxDrawdown: '63.74%',
    sharpeRatio: '3.45',
    isFavorite: false
  },
  {
    id: 3,
    name: 'TUYJHUI',
    avatar: '/static/icons/testAvatar.png',
    score: '8.7',
    totalScore: '/10',
    profit30d: '+24.11',
    rate30d: '101.86%',
    assetSize: '2,113,255.27',
    maxDrawdown: '63.74%',
    sharpeRatio: '3.45',
    isFavorite: true
  }
])

// 收藏的带单员
const favoriteTraders = computed(() => {
  return allTraders.value.filter(trader => trader.isFavorite)
})

// 当前显示的带单员列表
const traderList = computed(() => {
  const list = activeTab.value === '全部项目' ? allTraders.value : favoriteTraders.value
  // 只返回前两个带单员，其余的将在引导卡片之后显示
  return list.slice(0, 2)
})

// 剩余的带单员列表
const remainingTraders = computed(() => {
  const list = activeTab.value === '全部项目' ? allTraders.value : favoriteTraders.value
  // 返回从第三个开始的带单员
  return list.slice(2)
})

// 切换tab
const switchTab = (tab: string) => {
  activeTab.value = tab
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 刷新页面
const refreshPage = () => {
  // 模拟刷新操作
  console.log('刷新页面')
  // 可以在这里重新获取数据
}

// 查看带单员详情
const viewTraderDetails = (traderId: number) => {

  uni.navigateTo({
    url: '/pages/market/index',
    success: (res) => {
      console.log('navigateTo跳转成功:', res)
    },
    fail: (err) => {
      console.error('navigateTo跳转失败:', err)
    },
    complete: () => {
      console.log('navigateTo跳转完成')
    }
  })
  console.log('查看带单员详情函数被调用:', traderId)
}

// 跟单操作
const followTrader = (traderId: number) => {
  console.log('跟单函数被调用:', traderId)
  try {
    // 使用storage存储参数
    const setResult = storage.setSync('traderJumpParams', { traderId, source: 'follow' })
    console.log('参数存储结果:', setResult)

    // 打印存储的参数以验证
    const storedParams = storage.getSync('traderJumpParams')
    console.log('存储的参数:', storedParams)

    // 由于使用自定义tabbar，使用navigateTo跳转
    console.log('准备执行navigateTo跳转...')
    uni.navigateTo({
      url: '/pages/market/index',
      success: (res) => {
        console.log('navigateTo跳转成功:', res)
      },
      fail: (err) => {
        console.error('navigateTo跳转失败:', err)
      },
      complete: () => {
        console.log('navigateTo跳转完成')
      }
    })
  } catch (error) {
    console.error('跟单函数执行出错:', error)
  }
}

// 申请成为带单员
const applyTrader = () => {
  console.log('申请成为带单员')
  // 跳转到申请页面
}

// 跳转到客服页面
const goToCustomerService = () => {
  uni.navigateTo({
    url: '/pages/customerservice/index',
    success: () => console.log('✅ 跳转到客服页面成功'),
    fail: (err) => console.error('❌ 跳转到客服页面失败:', err)
  })
}

// 跳转到消息通知页面
const goToNotification = () => {
  uni.navigateTo({
    url: '/pages/notification/index',
    success: () => console.log('✅ 跳转到消息通知页面成功'),
    fail: (err) => console.error('❌ 跳转到消息通知页面失败:', err)
  })
}

// 监听语言变化，更新activeTab的值
watch(() => locale.value, (newLocale) => {
  // 保持当前选中的标签类型，但更新为新语言的文本
  if (activeTab.value === t('follow.allProjects', { locale: newLocale === 'zh-CN' ? 'en-US' : newLocale === 'en-US' ? 'zh-CN' : 'zh-CN' })) {
    activeTab.value = t('follow.allProjects')
  } else if (activeTab.value === t('follow.favorites', { locale: newLocale === 'zh-CN' ? 'en-US' : newLocale === 'en-US' ? 'zh-CN' : 'zh-CN' })) {
    activeTab.value = t('follow.favorites')
  }
})

onMounted(() => {
  console.log('跟单页面加载完成')
})
</script>

<style lang="scss" scoped>
.follow-page {
  min-height: 100vh;
  background: #202020;
  color: #ffffff;
  display: flex;
  flex-direction: column;
}

/* 固定头部区域 */
.fixed-header-area {
  background-color: #202020;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
}

/* 页面头部 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 32rpx 24rpx;
}

.header-left {
  // width: 80rpx;
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.profit-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.back-arrow {
  // font-size: 48rpx;
  width: 40rpx;
  height: 32rpx;
  // color: #ffffff;
}

.header-center {
  flex: 1;
  text-align: center;
  justify-content: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
}

.header-right {
  // width: 80rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24rpx;
  flex: 1;
}

.notification-wrapper {
  position: relative;
}

.header-icon {
  width: 46rpx;
  height: 46rpx;
  margin-left: 24rpx;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 15rpx;
  width: 20rpx;
  height: 20rpx;
  background-color: #EF4444;
  border-radius: 50%;
}

/* 申请成为带单员 */
.apply-section {
  margin-bottom: 24rpx;
  padding: 12rpx 32rpx;
  background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 0 32rpx 24rpx 32rpx;
}

.apply-section-bottom {
  margin-bottom: 24rpx;
  padding: 12rpx 32rpx;
  background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  // margin: 0 32rpx 24rpx 32rpx;
}

.apply-left {
  display: flex;
  flex-direction: column;
}

.apply-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}

.apply-action {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-top: 10rpx;
}

.apply-image {
  // position: absolute;
  // right: 32rpx;
  width: 156rpx;
  height: 156rpx;
}

/* 筛选区域 */
.filter-section {
  padding: 0 32rpx 24rpx 32rpx;
  // background-color: #1a1a1a;
}

.filter-tabs {
  display: flex;
  gap: 40rpx;
  margin-bottom: 30rpx;
}

.filter-tab {
  font-size: 28rpx;
  color: #999999;
}

.filter-tab.active {
  color: #ffffff;
  font-weight: 600;
  position: relative;
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: -8rpx;
  left: 0;
  width: 100%;
  height: 4rpx;
  background-color: #8b5cf6;
  border-radius: 2rpx;
}

.sort-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32rpx;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-right: 30rpx;
}

.sort-item1 {
  display: flex;
  align-items: center;
}

.sortList {
  display: flex;
  align-items: center;
}

.sort-text {
  font-size: 26rpx;
  color: #9AA4AE;
}

.sort-arrow {
  width: 20rpx;
  height: 20rpx;
}

.sort-icon {
  width: 32rpx;
  height: 32rpx;
}

/* 带单员列表 - 可滚动区域 */
.trader-list {
  padding: 0 32rpx;
  flex: 1;
  padding-top: 520rpx;
  /* 调整固定头部的估计高度 */
  height: calc(100vh - 520rpx);
  /* 计算剩余空间作为滚动区域高度 */
}

.trader-card {
  // background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
  // border-radius: 20rpx;
  padding: 32rpx 0;
  margin-bottom: 24rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
}

/* 代单引导卡片样式 */
.become-trader-card {
  // background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
  // border-radius: 20rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.12);
  padding: 32rpx 0;
  margin-bottom: 24rpx;
}

.become-trader-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.become-trader-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.become-trader-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}

.become-trader-action {
  font-size: 26rpx;
  color: #8b5cf6;
  font-weight: 500;
}

.become-trader-image {
  width: 180rpx;
  height: auto;
}

/* 带单员头部信息 */
.trader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-bottom: 32rpx;
  // padding-bottom: 24rpx;
  // border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.trader-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.trader-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}

.trader-name-section {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 12rpx;
}

.trader-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 28rpx;
}

.trader-score {
  font-size: 24rpx;
  color: rgba(154, 164, 174, 1);
  // padding: 4rpx 12rpx;
  // background-color: rgba(139, 92, 246, 0.1);
  // border-radius: 12rpx;
}

.score1 {
  color: #fff;
}

.trader-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.view-details {
  font-size: 24rpx;
  color: #cccccc;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 10rpx 16rpx;
  border-radius: 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.humanIcon {
  width: 20rpx;
  height: 22rpx;
  margin-right: 8rpx;
}

.follow-btn {
  font-size: 24rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #6a5acd 0%, #ff69b4 100%);
  padding: 10rpx 32rpx;
  border-radius: 16rpx;
  font-weight: 600;
  border: none;
}

/* 主要统计数据和图表区域 */
.trader-stats-container {
  padding-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-bottom: 32rpx;
  gap: 32rpx;
}

.profit-section {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999999;
}

.stat-value {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.stat-value.large {
  font-size: 42rpx;
  font-weight: 700;
  line-height: 1.2;
  color: #22c55e;
}

.stat-value.positive {
  color: #22c55e;
}

.stat-value.negative {
  // color: #ef4444;
}

/* 图表 */
.profit-chart {
  flex: 1;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.chart-image {
  width: 170rpx;
  height: 100rpx;
  object-fit: contain;
}

/* 详细统计数据 */
.trader-detailed-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-left: 70rpx;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.stat-row .stat-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.stat-row .stat-item:nth-child(1) {
  padding-right: 16rpx;
}

.stat-row .stat-item:nth-child(2) {
  padding-left: 16rpx;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  color: #999999;
}

.empty-text {
  font-size: 28rpx;
  text-align: center;
}

/* 底部占位 */
.bottom-space {
  height: 60rpx;
}
</style>