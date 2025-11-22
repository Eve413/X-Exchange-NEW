<template>
  <view class="auth-status-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <image src="/static/icons/ic_arrow_left.png" class="back-icon" />
      </view>
      <view class="nav-title">{{ t('auth.status.page_title') }}</view>
      <view class="nav-right"></view>
    </view>

    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-header">
        <image src="/static/icons/ic_avatar.png" class="avatar" />
        <view class="info-right">
          <view class="user-info">
            <view class="welcome-text">{{ t('auth.status.welcome') }}</view>
            <view class="uid-text">UID : 128374963</view>
          </view>
          <view class="verify-badge">
            <!-- <image src="/static/icons/ic_check_circle.png" class="badge-icon" /> -->
            <text class="badge-text">{{ t('auth.status.standard_verified') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 升级认证卡片 -->
    <view class="upgrade-card">
      <text class="upgrade-title">{{ t('auth.status.upgrade_title') }}</text>
      <text class="upgrade-required">{{ t('auth.status.required') }}</text>
      <text class="upgrade-item">{{ t('auth.status.address_proof') }}</text>
      <button class="upgrade-btn" @click="goToAdvancedVerification">{{ t('auth.status.advanced_verification') }}</button>
    </view>

    <!-- 账户限额卡片 -->
    <view class="limit-card">
      <text class="card-title">{{ t('auth.status.limits') }}</text>

      <view class="limit-item">
        <text class="limit-label">{{ t('auth.status.fiat_withdrawal_limit') }}</text>
        <text class="limit-value">50K USD 每日</text>
      </view>

      <view class="limit-item">
        <text class="limit-label">{{ t('auth.status.crypto_deposit_limit') }}</text>
        <text class="limit-value">无限额</text>
      </view>

      <view class="limit-item">
        <text class="limit-label">{{ t('auth.status.crypto_withdrawal_limit') }}</text>
        <text class="limit-value">8M USDT 每日</text>
      </view>

      <view class="limit-item">
        <text class="limit-label">{{ t('auth.status.c2c_limit') }}</text>
        <text class="limit-value">无限额</text>
      </view>
    </view>

    <!-- 个人信息卡片 -->
    <view class="info-card">
      <view class="info-header">
        <text class="card-title">{{ t('auth.status.personal_info') }}</text>
        <text class="update-text" @click="updateInfo">{{ t('auth.status.update_info') }} &gt;</text>
      </view>

      <view class="info-item">
        <text class="info-label">{{ t('auth.status.country') }}</text>
        <text class="info-value">中国</text>
      </view>

      <view class="info-item">
        <text class="info-label">{{ t('auth.status.full_name') }}</text>
        <text class="info-value">辛弃疾</text>
      </view>

      <view class="info-item">
        <text class="info-label">{{ t('auth.status.date_of_birth') }}</text>
        <text class="info-value">1149年5月28日</text>
      </view>

      <view class="info-item">
        <text class="info-label">{{ t('auth.status.id_card') }}</text>
        <text class="info-value">37011214005287975</text>
      </view>

      <view class="info-item">
        <text class="info-label">{{ t('auth.status.address') }}</text>
        <text class="info-value">山东省济南市历城区遥墙</text>
      </view>

      <view class="info-item">
        <text class="info-label">{{ t('auth.status.email') }}</text>
        <text class="info-value">123@qq.com</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 前往进阶身份认证
const goToAdvancedVerification = () => {
  uni.showToast({
    title: t('auth.status.feature_in_development'),
    icon: 'none'
  });
};

// 更新身份信息
const updateInfo = () => {
  uni.showToast({
    title: t('auth.status.feature_in_development'),
    icon: 'none'
  });
};

onLoad(() => {
  // 页面加载时的逻辑
  console.log('认证中心页面加载');
});
</script>

<style scoped lang="scss">
.auth-status-page {
  background-color: #202020;
  color: #ffffff;
  min-height: 100vh;
  padding-bottom: 60rpx;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  background-color: #202020;
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: 50rpx;
  box-sizing: content-box;
}

.back-btn {
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 40rpx;
  height: 32rpx;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
}

.nav-right {
  width: 40px;
}

/* 用户信息卡片 */
.user-card {
  margin: 16px;
  padding: 20px 30rpx;
  background-color: #2d2d2d;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info-right{
  display: flex;
  justify-content: flex-end;
}
.user-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // flex-direction: column;
  gap: 12px;
}
.user-info{
  display: flex;
  flex-direction: column;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-bottom: 8px;
}

.welcome-text {
  font-size: 18px;
  font-weight: 600;
}

.uid-text {
  font-size: 14px;
  color: #999999;
  margin-top: 4px;
}

.verify-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #325DF4;
  padding: 3px 12px;
  border-radius: 16px;
  align-self: flex-start;
  margin-top: 8px;
  margin-left: 5rpx;
  width: 250rpx;
}

.badge-icon {
  width: 14px;
  height: 14px;
}

.badge-text {
  font-size: 12px;
  color: #ffffff;
  text-align: center;
}

/* 升级认证卡片 */
.upgrade-card {
  margin: 16px;
  padding: 20px;
  background-color: #2d2d2d;
  border-radius: 12px;
}

.upgrade-title {
  font-size: 16px;
  margin-bottom: 12px;
  line-height: 1.4;
}

.upgrade-required {
  font-size: 14px;
  color: #ff9800;
  margin-bottom: 8px;
  font-weight: 500;
}

.upgrade-item {
  font-size: 14px;
  color: #cccccc;
  margin-bottom: 16px;
  line-height: 1.6;
}

.upgrade-btn {
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  width: 100%;
  margin-top: 15rpx;
  margin-bottom: 10rpx;
}

/* 限额卡片 */
.limit-card {
  margin: 16px;
  padding: 20px;
  background-color: #2d2d2d;
  border-radius: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.limit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #3d3d3d;
}

.limit-item:last-child {
  border-bottom: none;
}

.limit-label {
  font-size: 14px;
  color: #cccccc;
}

.limit-value {
  font-size: 14px;
  font-weight: 500;
}

/* 个人信息卡片 */
.info-card {
  margin: 16px;
  padding: 20px;
  background-color: #2d2d2d;
  border-radius: 12px;
  padding-bottom: 30px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.update-text {
  font-size: 16px;
  color: #667eea;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #3d3d3d;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #cccccc;
}

.info-value {
  font-size: 14px;
  text-align: right;
  flex: 1;
  margin-left: 16px;
}
</style>
