<template>
  <view class="page">
    <!-- Header -->
    <view class="header">
      <view class="nav">
        <view class="backBox">
          <image class="back" src="/static/icons/ic_arrow_left.png" mode="aspectFit" @click="goBack" />
        </view>

        <text class="title">确认协议</text>
        <view class="rightBox"></view>
      </view>

      <!-- Progress Bar -->
      <view class="progress-bar">
        <view class="progress"></view>
      </view>
    </view>

    <!-- Content -->
    <view class="content">
      <view class="section">
        <view class="section-top">
          <text class="section-title">确认协议</text>
          <text class="section-subtitle">点击可查看协议详情</text>
        </view>
        <view class="agreement-list">
          <view class="agreement-item" v-for="(item, index) in agreements" :key="index"
            @click="viewAgreementDetails(index)">
            <text class="agreement-text">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部确认按钮 -->
    <button class="confirm-button" @click="confirmAgreements">确认</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 协议列表
const agreements = ref([
  'ROCKALPHA Client Agreement',
  'ROCKALPHA Privacy policy',
  'Risk Disclosure Statement',
  'General Disclaimer',
  'Market Data Disclaimer',
  'Margin Disclosure Statement',
  'Information Disclaimer',
  'Client Declarations',
  'W-8BEN Tax Form'
])

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 查看协议详情
const viewAgreementDetails = (index: number) => {
  // 这里可以根据实际需求实现协议详情查看功能
  // 例如跳转到协议详情页面或弹出协议详情弹窗
  console.log('View agreement details:', agreements.value[index])
  uni.showToast({
    title: `查看协议: ${agreements.value[index]}`,
    icon: 'none'
  })
}

// 确认协议
const confirmAgreements = () => {
  // 这里可以实现确认协议后的逻辑
  // 例如提交确认信息到服务器，然后跳转到下一步
  console.log('Confirm all agreements')

  // 显示确认成功提示
  uni.showToast({
    title: '协议确认成功',
    icon: 'success'
  })

  // 跳转到KYC结果页面，默认显示"待处理"状态
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/createkyc/result?status=pending'
    })
  }, 1500)
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
  width: 100%;
  /* KYC流程的第一步进度 */
  height: 100%;
  background: #6F4BFD;
}

/* Content Style */
.content {
  margin-top: 190rpx;
  flex: 1;
  padding: 0 30rpx;
  padding-bottom: 150rpx;
  overflow-y: auto;
}

.section {
  width: 100%;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
  color: #fff;
}
.section-top{
  display: flex;
  flex-direction: column;
}

.section-subtitle {
  font-size: 24rpx;
  color: #9AA4AE;
  margin-bottom: 40rpx;
}

.agreement-list {
  background-color: #2A2A2A;
  border-radius: 20rpx;
  overflow: hidden;
}

.agreement-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #333;
}

.agreement-item:last-child {
  border-bottom: none;
}

.agreement-text {
  font-size: 28rpx;
  color: #fff;
}

/* 底部确认按钮 */
.confirm-button {
  position: fixed;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 678rpx;
  height: 84rpx;
  border: none;
  border-radius: 20rpx;
  background: linear-gradient(175deg, #5565B9, #CD5890);
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
}
</style>