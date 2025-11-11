<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="goBack" />
      <text class="title">立即开户</text>
    </view>

    <!-- Content di bawah -->
    <view class="content">
      <text class="main-title">{{ $t('kyc.intro.one_minute_fast_account_opening') }}</text>
      <text class="subtitle">
        {{ $t('kyc.intro.review_expected_within_one_business_day_data_protected') }}
      </text>

      <view class="list">
        <view class="item">
          <image class="dotCompas" src="/static/icons/ic_time.png" mode="widthFix" />
          <text class="text">{{ $t('kyc.intro.trial_funds_instantly_available_explore_now') }}</text>
        </view>
        <view class="item">
          <image class="dot2" src="/static/icons/ic_compas.png" mode="widthFix" />
          <text class="text">{{ $t('kyc.intro.browse_more_personalized_tradegpt_cards_daily') }}</text>
        </view>
        <view class="item">
          <image class="dot1" src="/static/icons/ic_base.png" mode="widthFix" />

          <text class="text">{{ $t('kyc.intro.unlock_top_traders_holdings_copy_wealth_secret_with_one_click') }}</text>
        </view>
      </view>

      <button class="btn" @click="openAccount">{{ $t('kyc.intro.open_account_now') }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const goBack = () => {
  uni.navigateBack()
}

const openAccount = () => {
  uni.navigateTo({
    url: '/pages/createkyc/createkyc'
  })
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100vh;
  background: url('/static/icons/bgIntro_kyc.png') no-repeat center center;
  background-size: cover;
  color: #fff;
  font-family: "PingFang SC", sans-serif;
  position: relative;
  overflow: hidden;
}

/* Header */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60rpx;
  position: relative;
  font-size: 32rpx;
  font-weight: 600;
}

.back {
  position: absolute;
  left: 30rpx;
  width: 48rpx;
  height: 48rpx;
}

.title {
  color: #fff;
  font-size: 36rpx;
}

/* Content di bawah */
.content {
  position: absolute;
  bottom: 260rpx;
  left: 0;
  right: 0;
  padding: 0 50rpx;
  text-align: left;
}

.main-title {
  font-size: 42rpx;
  font-weight: bold;
}

.subtitle {
  display: block;
  font-size: 26rpx;
  color: #ddd;
  margin-top: 10rpx;
  line-height: 1.6;
}

/* List items */
.list {
  margin-top: 40rpx;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.dot1 {
  width: 48rpx;
  height: 48rpx;
  margin-right: 14rpx;
}
.dot2{
  width: 48rpx;
  height: 48rpx;
  margin-right: 14rpx;
}

.dotCompas {
  width: 48rpx;
  height: 48rpx;
  margin-right: 14rpx;
}

.text {
  font-size: 28rpx;
  color: #eee;
}

/* Button */
.btn {
  width: 100%;
  height: 84rpx;
  margin: 80rpx auto 0;
  border: none;
  border-radius: 20rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
  // line-height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
