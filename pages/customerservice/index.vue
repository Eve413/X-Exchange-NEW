<template>
  <view class="chat-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <image class="back-icon" src="/static/icons/ic_arrow_left.png" mode="aspectFit" />
      </view>
      <text class="header-title">{{ $t('customerservice.title') }}</text>
      <view class="right"></view>
    </view>


    <!-- 聊天内容 -->
    <scroll-view class="chat-scroll" scroll-y :scroll-into-view="scrollToBottomId" scroll-with-animation>
      <!-- 智能助手信息 -->
      <view class="agent-box">
        <image class="avatar" :src="agent.avatar" />
        <view class="agent-info">
          <text class="agent-name">{{ $t('customerservice.agentName') }}</text>
          <text class="agent-status">{{ $t('customerservice.online') }} · <text class="desc">{{
            $t('customerservice.quickResponse') }}</text></text>
        </view>
      </view>

      <!-- 第一条系统消息 -->
      <view class="bubble agent">
        {{ $t('customerservice.welcomeMessage') }}
        {{ $t('customerservice.workTime') }}
        <text class="time">15:32</text>
      </view>

      <!-- 热门问题 -->
      <view class="bubble agent2">
        <view class="hot-title">{{ $t('customerservice.popularQuestions') }}</view>
        <view class="hot-item" v-for="i in 5" :key="i">
          • &nbsp;&nbsp;{{ $t('customerservice.question' + i) }}
        </view>
        <view class="transfer-box">
          <text class="transfer-text" @click="transferToHuman">{{ $t('customerservice.transferToHuman') }}</text>
          <text class="time">15:32</text>
        </view>
      </view>

      <view :id="scrollToBottomId"></view>
    </scroll-view>

    <!-- 输入框 -->
    <view class="input-bar">
      <input v-model="input" :placeholder="$t('customerservice.inputPlaceholder')" placeholder-class="placeholder"
        class="text-input" confirm-type="send" @confirm="send" />
      <view class="plus-btn" @click="onPlus">＋</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const agent = {
  avatar:
    '/static/icons/customerservice-avatar.png'
}

// 热门问题数据通过多语言配置获取，这里保留数组结构但不包含具体文本
const popular = new Array(5).fill('')

const input = ref('')
const scrollToBottomId = ref('bottom')

function goBack() {
  uni.navigateBack()
}

function send() {
  if (!input.value.trim()) return
  uni.showToast({ title: $t('customerservice.sendSuccess'), icon: 'none' })
  input.value = ''
}

function onPlus() {
  uni.showActionSheet({
    itemList: [$t('customerservice.sendImage'), $t('customerservice.commonQuestions')],
    success: res => console.log('选择', res.tapIndex)
  })
}

function transferToHuman() {
  uni.showToast({ title: $t('customerservice.transferring'), icon: 'none' })
}
</script>

<style scoped>
.chat-page {
  background-color: #1a1a1a;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 14px;
  position: relative;
}

/* 顶部栏 */
.header {
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #1a1a1a;
  padding: 0 20px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  padding-top: 50rpx;
  z-index: 10;
  /* border-bottom: 1px solid rgba(255, 255, 255, 0.05); */
}

.right {
  flex: 1;
}

.back-btn {
  flex: 1;
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.back-icon {
  width: 22px;
  height: 22px;
}

.header-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
}

/* 聊天区 */
.chat-scroll {
  flex: 1;
  padding: 14rpx;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.agent-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.agent-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.agent-name {
  font-size: 15px;
  font-weight: 600;
}

.agent-status {
  font-size: 12px;
  color: #6F4BFD;
}

.agent2 {
  width: fit-content;
  padding: 30rpx 50rpx !important;
}

.desc {
  color: #A0A6B9;
}

.dot {
  width: 8px;
  height: 8px;
  background: #32d74b;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

/* 气泡样式 */
.bubble {
  background-color: #2A2A2A;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 36px;
  color: #e6e6e6;
  line-height: 1.6;
  position: relative;
}

.bubble.agent {
  align-self: flex-start;
}

.agent {
  width: fit-content;
  max-width: 580rpx !important;
  margin-top: 30rpx;
}

.time {
  color: #999;
  font-size: 12px;
  text-align: right;
  display: block;
  margin-top: 6px;
  position: absolute;
  padding: 20rpx 0;
  right: 20rpx;
}

/* 热门问题 */
.hot-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: #fff;
}

.hot-item {
  margin-bottom: 4px;
  color: #dcdcdc;
  font-size: 14px;
}

.transfer-box {
  margin-top: 8px;
}

.transfer-text {
  color: #4e8cff;
  font-size: 14px;
}

/* 输入区 */
.input-bar {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: #1a1a1a;
  padding-bottom: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.text-input {
  flex: 1;
  background-color: #2A2A2A;
  height: 86rpx;
  border-radius: 18px;
  color: #fff;
  padding: 0 40rpx;
  font-size: 26rpx;
}

.placeholder {
  color: #888;
}

.plus-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #2A2A2A;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9AA4AE;
  font-size: 22px;
  border: 1rpx solid #9AA4AE;
  /* line-height: 34px; */
  /* text-align: center; */
  padding-bottom: 4rpx;
  margin-left: 8px;
}
</style>
