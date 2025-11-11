<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <view class="nav">
        <view class="backBox">
          <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="goBack" />
        </view>

        <text class="title">实名认证</text>
        <view class="rightBox"></view>
      </view>

      <!-- Progress Bar -->
      <view class="progress-bar">
        <view class="progress" style="width: 100%;"></view>
      </view>
    </view>

    <!-- Content -->
    <view class="content">
      <!-- 状态图标 -->
      <view class="status-container">
        <view class="status-icon">
          <image :src="statusImage" mode="aspectFit" class="status-img" />
        </view>

        <!-- 状态文本 -->
        <text class="status-title">{{ statusTitle }}</text>
        <text class="status-desc">预计1个工作日审核完成</text>
      </view>

      <!-- 社群部分 -->
      <view class="community-section">
        <text class="community-title">下一步 加入社群</text>
        <text class="community-desc">高收益牛人都在群内，更有优质投研内容每日推送助你不错过任何财富密码！</text>

        <view class="community-list">
          <view class="community-item" @click="joinCommunity('wechat')">
            <image src="/static/icons/wechatIcon.png" mode="aspectFit" class="community-icon" />
            <text class="community-name">微信</text>
            <image src="/static/icons/ic_arrow_right.png" mode="aspectFit" class="arrow-icon" />
          </view>

          <view class="community-item" @click="joinCommunity('telegram')">
            <image src="/static/icons/telegramIcon.png" mode="aspectFit" class="community-icon" />
            <text class="community-name">Telegram</text>
            <image src="/static/icons/ic_arrow_right.png" mode="aspectFit" class="arrow-icon" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <button class="back-button" @click="goToHome">返回首页</button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状态类型定义
type StatusType = 'success' | 'pending' | 'failed'

// 页面参数
let status = ref<StatusType>('pending')

// 获取页面参数
onLoad((options: any) => {
  if (options.status && ['success', 'pending', 'failed'].includes(options.status)) {
    status.value = options.status as StatusType
  }
})

// 计算属性 - 状态样式类
const statusClass = computed(() => {
  return {
    'success': status.value === 'success',
    'pending': status.value === 'pending',
    'failed': status.value === 'failed'
  }
})

// 计算属性 - 状态图片
const statusImage = computed(() => {
  switch (status.value) {
    case 'success':
      return '/static/icons/successImg.png'
    case 'failed':
      return '/static/icons/failedImg.png'
    case 'pending':
    default:
      return '/static/icons/pendingImg.png'
  }
})

// 计算属性 - 状态标题
const statusTitle = computed(() => {
  switch (status.value) {
    case 'success':
      return '提交成功'
    case 'failed':
      return '审核失败'
    case 'pending':
    default:
      return '审核中'
  }
})

// 返回上一页
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    goToHome()
  }
}

// 返回首页
const goToHome = () => {
  uni.reLaunch({
    url: '/pages/home/index'
  })
}

// 加入社群
const joinCommunity = (type: 'wechat' | 'telegram') => {
  uni.showToast({
    title: `加入${type === 'wechat' ? '微信' : 'Telegram'}社群`,
    icon: 'none'
  })
  // 这里可以添加实际的社群加入逻辑
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #202020;
  color: #fff;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  background: #202020;
  z-index: 100;
  padding: 60rpx 30rpx 20rpx;
  box-sizing: border-box;
}

.nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.backBox {
  flex: 1;
}

.back {
  width: 40rpx;
  height: 36rpx;
}

.rightBox {
  flex: 1;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  flex: 1;
  text-align: center;
  color: #fff;
}

/* 进度条样式 */
.progress-bar {
  height: 20rpx;
  background-color: #222;
  border-radius: 10rpx;
  overflow: hidden;
  margin-top: 20rpx;
}

.progress {
  height: 100%;
  background: #6F4BFD;
}

/* Content Style */
.content {
  margin-top: 260rpx;
  flex: 1;
  padding: 0 30rpx;
  padding-bottom: 200rpx;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 状态容器 */
.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.status-icon {
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  position: relative;
  background-color: transparent;
}

// .status-icon.success {
//   background-color: #6F4BFD;
//   box-shadow: 0 0 0 40rpx rgba(111, 75, 253, 0.3), 0 0 0 80rpx rgba(111, 75, 253, 0.1);
// }

// .status-icon.pending {
//   background-color: #5565B9;
//   box-shadow: 0 0 0 40rpx rgba(85, 101, 185, 0.3), 0 0 0 80rpx rgba(85, 101, 185, 0.1);
// }

// .status-icon.failed {
//   background-color: #CD5890;
//   box-shadow: 0 0 0 40rpx rgba(205, 88, 144, 0.3), 0 0 0 80rpx rgba(205, 88, 144, 0.1);
// }

.status-img {
  width: 284rpx;
  height: 284rpx;
  z-index: 1;
}

.status-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10rpx;
}

.status-desc {
  font-size: 26rpx;
  color: #9AA4AE;
}

/* 社群部分 */
.community-section {
  width: 100%;
  margin-top: 40rpx;
}

.community-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 15rpx;
  display: block;
}

.community-desc {
  font-size: 24rpx;
  color: #9AA4AE;
  line-height: 1.5;
  margin-bottom: 30rpx;
  display: block;
}

.community-list {
  width: 100%;
  // background-color: #2A2A2A;
  border-radius: 20rpx;
  overflow: hidden;
}

.community-item {
  width: 100%;
  padding: 24rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2A2A2A;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  // border-bottom: 1rpx solid #333;
}

.community-item:last-child {
  border-bottom: none;
}

.community-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.community-name {
  font-size: 28rpx;
  color: #fff;
  flex: 1;
}

.arrow-icon {
  width: 28rpx;
  height: 28rpx;
  opacity: 0.5;
}

/* 底部返回首页按钮 */
.back-button {
  position: fixed;
  bottom: 80rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 684rpx;
  height: 84rpx;
  border: none;
  border-radius: 20rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  padding: 0;
}

.back-button::after {
  border: none;
}

/* 动画效果 */
@keyframes pulse-success {
  0% {
    opacity: 0.8;
    transform: scale(1.2);
  }

  100% {
    opacity: 0;
    transform: scale(1.6);
  }
}

@keyframes pulse-pending {
  0% {
    opacity: 0.8;
    transform: scale(1.2);
  }

  100% {
    opacity: 0;
    transform: scale(1.6);
  }
}

@keyframes pulse-failed {
  0% {
    opacity: 0.8;
    transform: scale(1.2);
  }

  100% {
    opacity: 0;
    transform: scale(1.6);
  }
}
</style>