<template>
  <view class="product-detail-page">
    <!-- 顶部安全区 -->
    <view class="status-bar-spacer" :style="getTopStyle(0)"></view>

    <!-- 头部导航栏 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="back-arrow">
          <image class="back-arrow-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="shareProduct" />
        </text>
      </view>
      <text class="page-title">{{ t('wealth.product_detail') }}</text>
      <view class="header-actions">
        <image class="share-icon" src="/static/icons/share.png" mode="aspectFit" @click="shareProduct" />
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 产品基本信息 -->
      <view class="product-header-section">
        <view class="product-basic-info">
          <image class="product-icon" :src="productInfo?.Staking?.icon" mode="aspectFit" />
          <view class="product-name-container">
            <text class="product-name">{{ productInfo?.Staking?.baseAsset }}</text>
            <text class="product-full-name">{{ productInfo?.Staking?.name }}</text>
          </view>
          <view class="product-tag">
            <text class="tag-text">{{ productInfo?.Staking?.category }}</text>
          </view>
        </view>

        <view class="product-return-info">
          <view class="return-item">
            <text class="return-label">{{ t('wealth.annual_return_rate') }}</text>
            <text class="return-value green-text">{{ productInfo?.Staking?.apr_percent }}%</text>
          </view>
          <view class="return-item">
            <text class="return-label">{{ t('wealth.wealth_period') }}</text>
            <text class="return-value">{{ productInfo?.Staking?.type }}</text>
          </view>
        </view>
      </view>

      <!-- 产品特点 -->
      <view class="features-section">
        <text class="section-title">{{ t('wealth.product_features') }}</text>
        <view class="features-grid">
          <view class="feature-item">
            <view class="feature-icon">
              <image class="ListIcon" src="/static/icons/icons1.png" mode="aspectFit" @click="shareProduct" />
              <!-- <text class="feature-icon-text">📈</text> -->
            </view>
            <text class="feature-text">{{ t('wealth.deposit_withdraw') }}</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">
              <image class="ListIcon" src="/static/icons/icons2.png" mode="aspectFit" @click="shareProduct" />
              <!-- <text class="feature-icon-text">📊</text> -->
            </view>
            <text class="feature-text">{{ t('wealth.daily_interest') }}</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">
              <image class="ListIcon" src="/static/icons/icons3.png" mode="aspectFit" @click="shareProduct" />
              <!-- <text class="feature-icon-text">🚀</text> -->
            </view>
            <text class="feature-text">{{ t('wealth.t_plus_0') }}</text>
          </view>
        </view>
      </view>

      <!-- 产品信息 -->
      <view class="info-section">
        <text class="section-title">{{ t('wealth.product_info') }}</text>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">{{ t('wealth.min_purchase') }}</text>
            <text class="info-value">{{ productInfo?.Staking?.min_deposit }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">{{ t('wealth.total_quota') }}</text>
            <text class="info-value">{{ productInfo?.Staking?.total_quota }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">{{ t('wealth.remaining_quota') }}</text>
            <text class="info-value remaining">>{{ productInfo?.Staking?.remaining_quota }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">{{ t('wealth.interest_calculation') }}</text>
            <text class="info-value">{{ productInfo?.Staking?.interest_method }}</text>
          </view>
        </view>
      </view>

      <!-- 申购金额 -->
      <view class="purchase-section">
        <text class="section-title">{{ t('wealth.purchase_amount') }}</text>
        <view class="available-balance">
          <text class="balance-label">{{ t('wealth.available_balance') }}</text>
          <text class="balance-value">{{ productInfo?.Balance?.total }}</text>
          
        </view>

        <view class="amount-input-container">
          <input class="amount-input" type="digit" placeholder="" v-model="purchaseAmount"
            :placeholder-class="'placeholder-class'" />
          <view class="currency-selector">
            <text class="currency-text">{{ productInfo?.Balance?.baseAsset }}</text>
            <image class="dropdown-icon" src="/static/tubiao/xiala.png" mode="aspectFit" />
          </view>
        </view>
        <text class="input-hint">{{ t('wealth.min_purchase') }}: {{  productInfo?.Balance?.total }}</text>

        <view class="estimated-return">
          <text class="return-label">{{ t('wealth.estimated_daily_return') }}</text>
          <text class="return-value green-text">{{productInfo?.Balance?.total  }}</text>
        </view>
      </view>

      <!-- 风险提示 -->
      <view class="risk-section">
        <view class="risk-icon">
          <text class="risk-icon-text">⚠</text>
        </view>
        <text class="risk-text">{{ t('wealth.risk_disclaimer') }}</text>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- 底部确认按钮 -->
    <view class="bottom-action">
      <button class="confirm-button" @click="confirmPurchase">
        {{ t('wealth.confirm_purchase') }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { tl } from "@/utils/i18n";
import { useSafeArea } from "@/utils/composables/useSafeArea";
import {useUserStore, StakingsDetilsParams, StakingsSubscriptionParams} from '@/store/modules/user'
const userInfo = uni.getStorageSync('userData')
const userStore = useUserStore()

const { getTopStyle } = useSafeArea();
const t = tl;

// 获取页面参数
const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const productId = currentPage.options.id || '1';

// 申购金额
const purchaseAmount = ref('');

// 产品详情模拟数据
const productInfo = ref({
  // id: productId,
  // name: 'BTC',
  // fullName: 'Bitcoin',
  // icon: '/static/logo/logos_bitcoin.png',
  // tag: t('wealth.hot'),
  // annualRate: '10.00',
  // period: t('wealth.flexible'),
  // minPurchase: '0.001 BTC',
  // totalQuota: '100 BTC',
  // remainingQuota: '45.8 BTC',
  // interestCalculation: t('wealth.daily_interest'),
  // availableBalance: '10,000 USDT',
  // currency: 'BTC',
  // estimatedDailyReturn: '0.01 BTC'
});

onMounted(async () => {
  // 这里可以根据productId获取不同的产品数据
  console.log('产品详情页面加载，产品ID:', productId);

   try {
          const stakingsDetilsParams: StakingsDetilsParams = {
            passkey: userStore.pasKeyAuth,
            device:userStore.deviceAuth,
            appversion:userStore.appversionAuth,
            token: userInfo.data.token,
            lang: userStore.language,
            staking_id: productId
          }

          

          const resultStakings = await userStore.getStakingsDetil(stakingsDetilsParams)

      
              if (resultStakings.data.status === -1){
                            handleLogout()
                        }
          productInfo.value = resultStakings.data.data
        //   balance.value = resultStakings.data.data.Balance
        //   features.value = resultStakings.data.data.Staking.Feature
         
    
        } catch (e) {
          console.error('❌ Failed to load tickers:', e)
        }
});

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

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 分享产品
const shareProduct = () => {
  console.log('分享产品:', productId);
  // 这里可以实现分享功能
};

// 确认申购
const confirmPurchase = async () => {
  

  try {
    

   if (!purchaseAmount.value) {
    console.log('请输入申购金额');
    return;
  }

    // const [amount, symbol] = purchaseAmount.value.total.split(" ")

    const stakingsSubscriptionParams: StakingsSubscriptionParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: userStore.language,
      staking_id: productId,
      amount: purchaseAmount.value
    }

    console.log('🧾 Sending subscription params:', stakingsSubscriptionParams)

    const resultStakings = await userStore.postStakingsSubscriptionParams(stakingsSubscriptionParams)

    console.log
    if (resultStakings?.data?.status === -1) {
      handleLogout()
      return
    } else {
      uni.showToast({
        title: resultStakings.data.msg,
        icon: resultStakings.data.msg
      })
    }

  } catch (e) {
    console.error('❌ Failed to subscribe staking:', e)
    uni.showToast({
      title: 'Network error',
      icon: 'none'
    })
  }

  console.log('确认申购，金额:', purchaseAmount.value, productInfo.value.currency);
  // 这里可以实现申购逻辑
};
</script>

<style lang="scss" scoped>
.product-detail-page {
  height: 100vh;
  background: #202020;
  padding: 0 30rpx;
  color: #ffffff;
  overflow: hidden;
}

// 头部样式
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0rpx;
  background: #202020;
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: 70rpx;
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
.back-arrow-icon{
  width: 40rpx;
  height: 32rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.share-icon {
  width: 44rpx;
  height: 44rpx;
  opacity: 0.8;
}

// 内容滚动区域
.content-scroll {
  height: calc(100vh - 120rpx);
  padding-bottom: 80rpx;
}

// 产品头部信息区域
.product-header-section {
  padding: 32rpx;
  background: #2A2A2A;
  border-radius: 20rpx;
  margin-top: 20rpx;
}

.product-basic-info {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
  gap: 16rpx;
}

.product-icon {
  width: 80rpx;
  height: 80rpx;
}

.product-name-container {
  flex: 1;
}

.product-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4rpx;
  display: block;
}

.product-full-name {
  font-size: 24rpx;
  color: #9AA4AE;
  display: block;
}

.product-tag {
  background: rgba(59, 130, 246, 0.2);
  padding: 6rpx 20rpx;
  border-radius: 16rpx;
}

.tag-text {
  font-size: 24rpx;
  color: #3b82f6;
  font-weight: 500;
}

.product-return-info {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-top: 32rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.return-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // flex: 1;
}

.return-label {
  font-size: 24rpx;
  color: #9AA4AE;
  display: block;
  margin-bottom: 8rpx;
}

.return-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}
.green-text{
  color: #19AF00;
}

// 通用区块样式
.features-section,
.info-section,
.purchase-section {
  margin: 32rpx 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 28rpx;
  display: block;
}

// 产品特点样式
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.feature-item {
  background: #2A2A2A;
  border-radius: 20rpx;
  padding: 32rpx 16rpx;
  text-align: center;
}

.feature-icon {
  // width: 80rpx;
  // height: 80rpx;
  // border-radius: 50%;
  // background: rgba(139, 92, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16rpx;
}

.ListIcon {
  width: 36rpx;
  height: 36rpx;
}

.feature-icon-text {
  font-size: 36rpx;
}

.feature-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 500;
}

// 产品信息样式
.info-grid {
  background: #2a2a2a;
  border-radius: 20rpx;
  overflow: hidden;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #9AA4AE;
}

.info-value {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.info-value.remaining {
  color: #19AF00;
}

// 申购金额样式
.available-balance {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.balance-label {
  font-size: 24rpx;
  color: #9AA4AE;
}

.balance-value {
  font-size: 24rpx;
  color: #ffffff;
}

.amount-input-container {
  display: flex;
  align-items: center;
  background: #2a2a2a;
  border-radius: 20rpx;
  padding: 0 32rpx;
  margin-bottom: 16rpx;
}

.amount-input {
  flex: 1;
  height: 100rpx;
  color: #ffffff;
  font-size: 40rpx;
  font-weight: 600;
  background: none;
}

.currency-selector {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.currency-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
}

.dropdown-icon {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.6;
}

.input-hint {
  font-size: 22rpx;
  color: #666666;
  margin-bottom: 24rpx;
  display: block;
}

.estimated-return {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2a2a2a;
  border-radius: 20rpx;
  padding: 28rpx 32rpx;
}

// 风险提示样式
.risk-section {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 0 32rpx 32rpx;
}

.risk-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(234, 179, 8, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
}

.risk-icon-text {
  font-size: 24rpx;
}

.risk-text {
  flex: 1;
  font-size: 24rpx;
  color: #9AA4AE;
  line-height: 1.6;
}

// 底部占位
.bottom-spacer {
  height: 140rpx;
}

// 底部确认按钮
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: #202020;
  // border-top: 1rpx solid rgba(255, 255, 255, 0.1);
}

.confirm-button {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 20rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-button:active {
  opacity: 0.9;
}

// 占位符样式
.placeholder-class {
  color: #666666;
}
</style>