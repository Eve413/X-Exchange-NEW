<template>
  <view class="locked-container">
    <!-- 返回按钮 -->
    <view class="header">
      <image class="back-btn" :src="'/static/icons/ic_arrow_left.png'" @click="handleBack"></image>
    </view>

    <!-- 中间内容区域 -->
    <view class="content">
      <image class="locked-image" :src="'/static/icons/lockedImg.png'"></image>
      <text class="locked-text">解锁中，该功能还未开放使用</text>
      <view class="footer">
        <view class="return-button" @click="handleBack">返回</view>
      </view>
    </view>

    <!-- 底部按钮 -->

  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { navigateBack } from '@/utils/navigation'

// 处理返回操作
const handleBack = () => {
  navigateBack()
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped lang="scss">
.locked-container {
  width: 100%;
  height: 100vh;
  background-color: #202020;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.header {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding-left: 30rpx;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  padding-top: 80rpx;
}

.back-btn {
  width: 40rpx;
  height: 32rpx;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 40rpx;
  width: 100%;
}

.locked-image {
  width: 352rpx;
  height: 248rpx;
  margin-bottom: 48rpx;
  object-fit: contain;
  margin-top: 300rpx;
}

.locked-text {
  font-size: 28rpx;
  color: #9AA4AE;
  text-align: center;
  line-height: 48rpx;
  font-weight: 400;
}

.footer {
  // width: 100%;
  // padding: 0 40rpx 80rpx;
  // box-sizing: border-box;
  // display: flex;
  // justify-content: center;
  // margin-top: auto;
  .return-button{
    width: 140rpx;
    padding: 16rpx 10rpx;
  }
}

.return-button {
  width: 100%;
  // height: 96rpx;
  background: linear-gradient(90deg, #7B61FF 0%, #FF5C87 100%);
  border-radius: 48rpx;
  font-size: 26rpx;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  font-weight: 500;
  // 修复uni-app按钮默认样式
  padding: 0;
  line-height: normal;
  margin-top: 40rpx;
}

// 移除uni-app按钮的默认样式
.return-button::after {
  border: none;
}
</style>