<template>
  <view class="newlisting-detail-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <image src="/static/icons/ic_arrow_left.png" mode="aspectFit" class="back-button-icon" />
      </view>
      <text class="header-title">{{ t('newlisting.detail.title') }}</text>
      <view class="share-button">
        <image src="/static/icons/share.png" mode="aspectFit" class="share-icon" />
      </view>
    </view>

    <!-- 项目基本信息 -->
    <view class="project-box">
      <view class="project-info">
        <view class="project-header">
          <view class="project-left">
            <image :src="data?.icon" mode="aspectFit" class="project-icon" />

            <view class="project-bottom">
              <text class="project-name">{{ data?.baseAsset }}</text>
               <view class="project-description" v-html="data?.description"></view>
              <!-- <text class="project-description">{{ t('newlisting.detail.project_description') }}</text> -->
            </view>

          </view>

          <view class="project-title-container">

            <view class="project-status status-ongoing">
              <text class="status-text">{{data?.airdrop_status}}</text>
            </view>
          </view>
        </view>

      </view>

      <!-- 募集进度 -->
      <view class="progress-section">
        <view class="progress-header">
          <text class="progress-label">{{ t('newlisting.detail.funding_progress') }}</text>
          <text class="progress-amount">{{data?.progress?.raised}} / {{data?.progress?.target}}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: '65%' }"></view>
        </view>
        <view class="progress-stats">
          <text class="progress-percentage">{{data?.progress?.percent}} {{ t('newlisting.detail.completed') }}</text>
          <text class="participants-count">{{data?.progress?.participants}} {{ t('newlisting.detail.participants') }}</text>
        </view>
        <view class="countdown">
          <text class="countdown-text">{{ t('newlisting.detail.time_remaining') }} {{data?.time_remaining}}</text>
        </view>
      </view>
    </view>

    <!-- 认购金额 -->
    <view class="purchase-section">
      <view class="section-title">
        <text class="title-text">{{ t('newlisting.detail.purchase_amount') }}</text>
        <text class="price-text">{{data?.subscription?.price}}</text>
      </view>

      <view class="amount-input">
        <input type="number" v-model="purchaseAmount" class="input-field" placeholder="0" />
        <view class="coin-selector">
          <text class="coin-name">USDT</text>
          <text class="dropdown-icon">▼</text>
        </view>
      </view>

      <view class="estimated-return">
        <text class="estimated-label">{{ t('newlisting.detail.estimated_return') }}</text>
        <text class="estimated-value1">{{data?.subscription?.price_receive}}</text>
      </view>

      <view class="limit-info">
        <text class="limit-text">{{ t('newlisting.detail.min_purchase') }}: 10.00 USDT</text>
        <text class="limit-text">{{ t('newlisting.detail.max_purchase') }}: 10,000.00 USDT</text>
      </view>
    </view>

    <!-- 项目详情 -->
    <view class="project-details-section">
      <text class="section-title-text">{{ t('newlisting.detail.project_details') }}</text>
      <view class="section-top">
        <view class="detail-item">
          <view class="detail-label">{{ t('newlisting.detail.start_time') }}</view>
          <view class="detail-value">{{ data?.details?.start_date }}</view>
        </view>

        <view class="detail-item">
          <view class="detail-label">{{ t('newlisting.detail.end_time') }}</view>
          <view class="detail-value">{{data?.details?.end_date}}</view>
        </view>
      </view>

      <view class="highlights-section">
        <text class="section-title-text">{{ t('newlisting.detail.project_highlights') }}</text>

         <view v-for="(point, i) in data?.details?.highlights" :key="i" class="highlight-item">
            <view class="highlight-item">
              <image src="/static/icons/checkImg.png" mode="aspectFit" class="check-icon" />
              <text class="highlight-text">{{ point.title }}</text>
            </view>
        </view>
      </view>
      <!-- 解锁时间表 -->
      <view class="unlock-section">
        <text class="section-title-text2">{{ t('newlisting.detail.unlock_schedule') }}</text>

        <view
          v-for="(item, i) in data?.details?.unlock_schedule"
          :key="i"
        >
        <view class="unlock-item">
          <text class="unlock-time">{{item.title}}</text>
          <text class="unlock-percentage">{{ item.percentage }}</text>
        </view>
        </view>

      </view>
    </view>

    <!-- 项目亮点 -->




    <!-- 风险提示 -->
    <view class="risk-section">
      <view class="risk-header">
        <text class="risk-icon">⚠</text>
        <text class="risk-title">{{ t('newlisting.detail.risk_warning') }}</text>
      </view>

      <view class="risk-content">

         <view class="risk-text" v-html="data?.risk_warning"></view>
        <!-- <text class="risk-text">• {{ t('newlisting.detail.risk_volatility') }}</text>
        <text class="risk-text">• {{ t('newlisting.detail.risk_market') }}</text>
        <text class="risk-text">• {{ t('newlisting.detail.risk_technical') }}</text>
        <text class="risk-text">• {{ t('newlisting.detail.risk_assessment') }}</text> -->
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <button class="confirm-button">{{ t('newlisting.detail.confirm_purchase') }}</button>
      <button class="cancel-button" @click="goBack">{{ t('newlisting.detail.go_back') }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore,AirdropsSubscriptionDetilParams } from '@/store/modules/user'
const userStore = useUserStore()
const userInfo = uni.getStorageSync('userData')
const { t } = useI18n();

const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const productId = currentPage.options.id || '1';
const data = ref({})

// 认购金额
const purchaseAmount = ref('10000');

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(async () => {


   try {

    const params: AirdropsSubscriptionDetilParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: 'en',
      id:  productId,
    }

    const result = await userStore.postAirdropsSubscriptionDetil(params)
    if (result.data.status === -1) {
      handleLogout()
    } else{
      data.value = result.data.data
      purchaseAmount.value = data.value.subscription.balance
    }
  } catch (e) {
    console.error('❌ Failed to load details:', e)
  }
})

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除所有用户相关数据
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isRegistered')
        uni.removeStorageSync('isLoggedIn')
        uni.removeStorageSync('login_cache')

        // 显示退出成功提示
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })

        // 跳转到启动页
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/auth/startup' })
        }, 1000)
      }
    }
  })
}


</script>

<style lang="scss" scoped>
.newlisting-detail-page {
  background-color: #202020;
  min-height: 100vh;
  color: #FFFFFF;
  padding: 0 30rpx;
  padding-bottom: 200rpx;
  padding-top: 200rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  background-color: #202020;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 30rpx;
  padding-top: 50rpx;
  // padding-bottom: 20rpx;
  // border-bottom: 1rpx solid #333333;
  box-sizing: content-box;
}

.back-button,
.share-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button-icon {
  width: 40rpx;
  height: 32rpx;
}

.project-left {
  display: flex;
}

.project-bottom {
  display: flex;
  flex-direction: column;
}

.back-icon,
.share-icon {
  font-size: 36rpx;
  color: #FFFFFF;
  width: 36rpx;
  height: 36rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.project-info {
  // padding: 20rpx 0;
  // background-color: #202020;
  margin-bottom: 20rpx;
  position: relative;
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.project-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.project-title-container {
  display: flex;
  align-items: center;
}

.project-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-right: 16rpx;
}

.project-status {
  padding: 2rpx 16rpx;
  border-radius: 40rpx;
  background-color: rgba(111, 75, 253, 0.12);
  ;
  color: #6F4BFD;
  position: absolute;
  right: 5rpx;
  top: 5rpx;
}

.status-text {
  font-size: 24rpx;
  // color: #FFFFFF;
}

.project-description {
  font-size: 28rpx;
  color: #9AA4AE;
  line-height: 44rpx;
}

.progress-section {
  // background-color: #202020;
  // padding: 0rpx 30rpx;
  margin-bottom: 20rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.progress-label {
  font-size: 28rpx;
  // font-weight: 600;
  color: #9AA4AE;
}

.progress-amount {
  font-size: 28rpx;
  color: #ffffff;
}

.progress-bar {
  width: 100%;
  height: 16rpx;
  background-color: rgba(111, 75, 253, 0.12);
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.progress-fill {
  height: 100%;
  background: #6F4BFD;
  border-radius: 8rpx;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.progress-percentage,
.participants-count {
  font-size: 24rpx;
  color: #9AA4AE;
}

.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx;
  background-color: #333333;
  border-radius: 12rpx;
}

.countdown-text {
  font-size: 28rpx;
  color: #6F4BFD;
}

.purchase-section {
  background-color: #2A2A2A;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  margin-top: 30rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.price-text {
  font-size: 28rpx;
  color: #6F4BFD;
}

.amount-input {
  display: flex;
  align-items: center;
  background-color: #3B3B3B;
  border-radius: 12rpx;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}

.input-field {
  flex: 1;
  height: 100rpx;
  color: #FFFFFF;
  font-size: 36rpx;
  border: none;
  background: none;
}

.coin-selector {
  display: flex;
  align-items: center;
  padding: 20rpx;
}

.coin-name {
  font-size: 32rpx;
  color: #FFFFFF;
  margin-right: 8rpx;
}

.dropdown-icon {
  font-size: 20rpx;
  color: #9AA4AE;
}

.estimated-return {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.estimated-label {
  font-size: 28rpx;
  color: #9AA4AE;
}

.estimated-value {
  font-size: 28rpx;
  color: #6F4BFD;
}

.estimated-value1 {
  font-size: 28rpx;
  color: #19AF00;
}

.limit-info {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.limit-text {
  font-size: 24rpx;
  color: #9AA4AE;
}

.project-details-section {
  background-color: #2A2A2A;
  ;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
}

.section-title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 30rpx;
}

.section-title-text2 {
  font-size: 28rpx;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 30rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  padding: 20rpx 0;
  // border-bottom: 1rpx solid #333333;
}

.section-top {
  display: flex;
  justify-content: space-between;
}

.detail-label {
  font-size: 28rpx;
  color: #9AA4AE;
}

.detail-value {
  font-size: 24rpx;
  color: #FFFFFF;
  padding: 20rpx 32rpx;
  border-radius: 40rpx;
  background-color: #3B3B3B;
  margin-top: 20rpx;
}

.highlight-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  // border-bottom: 1rpx solid #333333;
}

.unlock-section {
  margin-top: 30rpx;
}

.check-icon {
  font-size: 24rpx;
  // color: #6F4BFD;
  margin-right: 20rpx;
  width: 32rpx;
  height: 32rpx;
  text-align: center;
}

.highlight-text {
  font-size: 28rpx;
  color: #FFFFFF;
}

.project-box {
  // margin-top: 200rpx;
  border-radius: 20rpx;
  background-color: #2A2A2A;
  padding: 20rpx;
}

.unlock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0rpx 40rpx;
  // border-bottom: 1rpx solid #333333;
  border-radius: 20rpx;
  background-color: #3B3B3B;
  margin-top: 20rpx;
  // padding: 10rpx 30rpx;
}

.unlock-time {
  font-size: 28rpx;
  color: #9AA4AE;
}

.unlock-percentage {
  font-size: 28rpx;
  color: #FFFFFF;
}

.risk-section {
  background-color: #2A2A2A;
  padding: 30rpx;
  margin-bottom: 200rpx;
  border-radius: 20rpx;
}

.risk-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.risk-icon {
  font-size: 28rpx;
  color: #FFD700;
  margin-right: 16rpx;
}

.risk-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.risk-content {
  padding-left: 44rpx;
}

.risk-text {
  font-size: 26rpx;
  color: #9AA4AE;
  line-height: 44rpx;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #202020;
  padding: 30rpx;
  box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.confirm-button {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.cancel-button {
  width: 100%;
  height: 96rpx;
  background-color: #202020;
  color: #C85EA1;
  display: flex;
  align-items: center;
  font-size: 30rpx;
  justify-content: center;
  font-weight: 500;
  border-radius: 20rpx;
  border: 1rpx solid #C85EA1;
}
</style>