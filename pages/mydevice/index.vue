<template>
  <view class="device-page-dialog">
    <!-- Header -->
    <view class="header-dialog">
      <image
        src="/static/icons/ic_arrow_left.png"
        class="back-icon-dialog"
        @click="goBack"
      />
      <text class="title-dialog">我的设备</text>
    </view>

    <!-- Device List -->
    <view class="device-list-dialog">
      <view
        v-for="(device, index) in devices"
        :key="index"
        class="device-card-dialog"
      >
        <view class="device-top-dialog">
          <view class="device-left-dialog">
            <image :src="device.icon" class="device-icon-dialog" />
            <text class="device-name-dialog">{{ device.name }}</text>
          </view>
          <view class="logout-btn-dialog" @click="logoutDevice(device)">
            退出
          </view>
        </view>

        <view class="device-info-dialog">
          <text>最近登录：{{ device.lastLogin }}</text>
          <text>登录地点：{{ device.location }}</text>
          <text>IP地址：{{ device.ip }}</text>
        </view>

        <view v-if="device.current" class="device-current-dialog">
          <image src="/static/icons/ic_check_green.png" class="check-icon-dialog" />
          <text>当前设备</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const devices = ref([
  {
    name: 'iPhone 15 Pro',
    lastLogin: '2025-09-28 20:23:24',
    location: 'Tokyo Japan',
    ip: '150.241.210.51',
    current: true,
    icon: '/static/icons/ic_phone.png'
  },
  {
    name: 'MacBook Pro',
    lastLogin: '2025-09-28 20:23:24',
    location: 'Tokyo Japan',
    ip: '150.241.210.51',
    current: false,
    icon: '/static/icons/ic_mac.png'
  }
])

function logoutDevice(device) {
  uni.showModal({
    title: '提示',
    content: `确定要退出 ${device.name} 吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出', icon: 'none' })
      }
    }
  })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.device-page-dialog {
  background-color: #111;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100rpx;
  background-color: #1e1e1e;
  border-bottom: 1rpx solid #2a2a2a;
}
.back-icon-dialog {
  position: absolute;
  left: 24rpx;
  width: 40rpx;
  height: 40rpx;
}
.title-dialog {
  font-size: 34rpx;
  font-weight: bold;
}

/* Device List */
.device-list-dialog {
  padding: 24rpx;
}

/* Card */
.device-card-dialog {
  background-color: #1e1e1e;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

/* Top section */
.device-top-dialog {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.device-left-dialog {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.device-icon-dialog {
  width: 40rpx;
  height: 40rpx;
}
.device-name-dialog {
  font-size: 30rpx;
  font-weight: 600;
}

/* Info section */
.device-info-dialog {
  display: flex;
  flex-direction: column;
  color: #a6a8ad;
  font-size: 26rpx;
  margin-top: 10rpx;
  gap: 4rpx;
}

/* Current device */
.device-current-dialog {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #71e28b;
  font-size: 26rpx;
  margin-top: 10rpx;
}
.check-icon-dialog {
  width: 26rpx;
  height: 26rpx;
}

/* Gradient button */
.logout-btn-dialog {
  background: linear-gradient(90deg, #9c4df4, #ff4d6d);
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #fff;
}
</style>
