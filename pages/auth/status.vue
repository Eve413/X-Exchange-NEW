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
            <view class="welcome-row">
              <view class="welcome-text">{{ t('auth.status.welcome') }}</view>
              <view class="verify-badge" :class="{ unverified: !isVerified }">
                <image src="/static/icons/status/ic_success.png" class="badge-icon" mode="widthFix" />
                <text class="badge-text">标准身份已认证</text>
              </view>
            </view>
            <view class="uid-text">UID : {{ dataProfile?.User?.id }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 升级认证卡片 -->
    <view class="upgrade-card">
      <text class="upgrade-title">{{ t('auth.status.upgrade_title') }}</text>
      <text class="upgrade-required-line">{{ t('auth.status.required') }} · {{ t('auth.status.address_proof') }}</text>
      <button class="upgrade-btn" @click="goToAdvancedVerification">{{ t('auth.status.advanced_verification') }}</button>
    </view>

    <!-- 账户限额卡片 -->
    <view class="limit-card">
      <text class="card-title">{{ t('auth.status.limits') }}</text>

      <view v-for="(item, index) in dataProfile?.AccountLimits" :key="index" class="limit-item">
        <text class="limit-label">{{ item?.name }}</text>
        <text class="limit-value">{{ item?.value }}</text>
      </view>

      <!-- <view class="limit-item">
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
      </view> -->
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
import { computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useI18n } from 'vue-i18n';
import {
  useUserStore,
  ProfileParams,
  BannerParams,
} from "@/store/modules/user";

const { t } = useI18n();
const userInfo = uni.getStorageSync("userData");
const userStore = useUserStore();
const dataProfile = ref({});
const isVerified = computed(() => {
  const name = (dataProfile.value as any)?.User?.MemberGroup?.name || '';
  const byName = /verified|认证|已认证/i.test(String(name));
  return Boolean(userStore.isKycApproved || byName);
});
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

onLoad(async (option) => {
  // 页面加载时的逻辑
  console.log('认证中心页面加载');

  try {
    // 确保用户信息存在
    if (!userInfo || !userInfo.data || !userInfo.data.token) {
      console.warn("❌ User token not found, using mock data");
      // 使用模拟数据
      dataProfile.value = mockProfileData;
      banners.value = mockBannerData;
      console.log("✅ Using mock data for profile and banners");
      return;
    }

    const profileParams: ProfileParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      token: userInfo.data.token,
      lang: userStore.language,
    };

    const bannerParams: BannerParams = {
      passkey: userStore.pasKeyAuth,
      device: userStore.deviceAuth,
      appversion: userStore.appversionAuth,
      lang: userStore.language,
    };

    console.log("🔄 Fetching profile data...");
    const resultProfile = await userStore.getProfile(profileParams);

    // 详细记录API返回状态
    console.log("🔍 Profile API result status:", resultProfile.data?.status);
    console.log("🔍 Profile API full result:", resultProfile);

    // 当API返回状态码为 -1（例如：账号在另一设备登录）时，强制退出并返回登录页
    if (resultProfile.data?.status === -1 || String(resultProfile.data?.data?.msg || '').includes('another device')) {
      uni.showToast({ title: '该账号已在另一设备登录，请重新登录', icon: 'none', duration: 2000 })
      try {
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isRegistered')
        uni.removeStorageSync('isLoggedIn')
        uni.removeStorageSync('login_cache')
        uni.removeStorageSync('token')
      } catch (_) {}
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/auth/login' })
      }, 300)
      return
    } else {
      // 正常情况：使用API返回的数据
      if (resultProfile.data?.data) {
        dataProfile.value = resultProfile.data.data;
        console.log("✅ Successfully loaded profile data");
      }
    }
  } catch (e) {
    console.error("❌ Failed to load profile data:", e);
    // 捕获错误时使用模拟数据渲染页面
    console.log("⚠️  Using mock data due to API error");
    dataProfile.value = mockProfileData;
    banners.value = mockBannerData;
  }
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
  height: 100rpx;
  padding: 0 32rpx;
  background-color: #202020;
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: 50rpx;
  box-sizing: content-box;
}

.back-btn {
  width: 80rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 40rpx;
  height: 32rpx;
}

.nav-title {
  font-size: 30rpx;
  font-weight: 600;
}

.nav-right {
  width: 80rpx;
}

/* 用户信息卡片 */
.user-card {
  margin: 32rpx;
  padding: 30rpx 30rpx;
  background-color: #2d2d2d;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info-right{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8rpx;
}
.user-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // flex-direction: column;
  gap: 8rpx;
}
.user-info{
  display: flex;
  flex-direction: column;
}
.welcome-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8rpx;
}
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  margin-bottom: 12rpx;
}

.welcome-text {
  font-size: 30rpx;
  font-weight: 600;
}

.uid-text {
  font-size: 26rpx;
  color: #999999;
  margin-top: 8rpx;
}

.verify-badge {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  background-color: #325DF4;
  padding: 2rpx 10rpx;
  border-radius: 999rpx;
  margin-left: 8rpx;
  width: fit-content;
  box-sizing: border-box;
  flex: 0 0 auto;
}

.verify-badge.unverified {
  background-color: #4A4A4A;
}

.badge-icon {
  width: 18rpx;
  height: 18rpx;
}

.badge-text {
  font-size: 18rpx;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
}
.verify-badge.unverified .badge-text {
  color: #cccccc;
}

/* 升级认证卡片 */
.upgrade-card {
  margin: 32rpx;
  padding: 30rpx;
  background-color: #2d2d2d;
  border-radius: 24rpx;
}

.upgrade-title {
  font-size: 28rpx;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

.upgrade-required {
  font-size: 26rpx;
  color: #ff9800;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.upgrade-item {
  font-size: 26rpx;
  color: #cccccc;
  margin-bottom: 24rpx;
  line-height: 1.6;
}

.upgrade-required-line {
  display: block;
  font-size: 26rpx;
  color: #ff9800;
  margin-bottom: 12rpx;
  font-weight: 500;
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
  margin: 32rpx;
  padding: 30rpx;
  background-color: #2d2d2d;
  border-radius: 24rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 600;
}

.limit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #3d3d3d;
}

.limit-item:last-child {
  border-bottom: none;
}

.limit-label {
  font-size: 26rpx;
  color: #cccccc;
}

.limit-value {
  font-size: 26rpx;
  font-weight: 500;
}

/* 个人信息卡片 */
.info-card {
  margin: 32rpx;
  padding: 30rpx;
  background-color: #2d2d2d;
  border-radius: 24rpx;
  padding-bottom: 44rpx;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.update-text {
  font-size: 28rpx;
  color: #667eea;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #3d3d3d;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 26rpx;
  color: #cccccc;
}

.info-value {
  font-size: 26rpx;
  text-align: right;
  flex: 1;
  margin-left: 32rpx;
}
</style>
