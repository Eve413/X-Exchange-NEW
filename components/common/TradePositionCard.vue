<template>
  <view class="card">
    <!-- Header -->
    <view class="header">
      <view class="left">
        <text class="order">{{ $t('trade-page.position-card.order-no') }} ：{{ orderId }}</text>
      </view>
      <view class="right">
        <text class="date">{{ date }}</text>
      </view>
    </view>

    <!-- Asset Info -->
    <view class="asset">
      <view>
        <view class="row">
          <image class="icon" :src="icon" mode="aspectFit" />
          <view class="info">
            <text class="name">{{ name }}</text>
            <text class="badge-text">{{ leverage }}</text>
          </view>
          <view class="badge">
            <text class="type">{{ positionType }}</text>
          </view>
        </view>

      </view>
      <!-- Duration bar -->
      <view class="duration">
        <text>{{ $t('trade-page.position-card.two') }}: {{ duration }}</text>
        <view class="bar">
          <view class="progress" :style="{ width: progress + '%' }"></view>
        </view>
      </view>
    </view>



    <!-- PnL and ROI -->
    <view class="summary">
      <view class="row-container">
        <text class="label">{{ $t('trade-page.position-card.three') }}</text>
        <text class="value positive">{{ pnl }} <text class="unit">USDT</text></text>
      </view>
      <view class="row-container">
        <text class="label">{{ $t('trade-page.position-card.five') }}</text>
        <text class="value">{{ roi }}%</text>
      </view>
    </view>

    <view class="divider"></view>

    <!-- Details -->
    <view class="details">
      <view class="row">
        <view class="column-container">
          <view class="column-container">
            <text>{{ $t('trade-page.position-card.six') }}</text>
            <text>{{ quantity }}</text>
          </view>
          <view class="column-container">
            <text>{{ $t('trade-page.position-card.nine') }}</text>
            <text>{{ liquidationPrice }}</text>
          </view>
        </view>
        <view class="column-container">
          <view class="column-container">
            <text>{{ $t('trade-page.position-card.seven') }}</text>
            <text>{{ openPrice }}</text>
          </view>
          <view class="column-container">
            <text>{{ $t('trade-page.position-card.ten') }}</text>
            <text>{{ markPrice }} ({{ markChange }})</text>
          </view>
        </view>
        <view class="column-container">
          <view class="column-container">
            <text>{{ $t('trade-page.position-card.eight') }}</text><text>{{ margin }}</text>
            <text>{{ $t('trade-page.position-card.eleven') }}</text>
            <text class="positive">{{ marginRate }}</text>
          </view>
        </view>
      </view>
    </view>


    <!-- Actions -->
    <view class="actions">
      <button class="btn gradient-radial" @click="$emit('addReduce')">{{ $t('trade-page.position-card.thirteen')
        }}</button>
      <button class="btn gradient-radial" @click="$emit('takeProfitStopLoss')">{{
        $t('trade-page.position-card.fourteen') }}</button>
      <button class="btn gradient-radial" @click="$emit('closePosition')">{{ $t('trade-page.position-card.fifteen')
        }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  orderId: string
  date: string
  name: string
  icon: string
  positionType: string
  leverage: string
  duration: string
  progress: number
  pnl: number
  roi: number
  quantity: number
  openPrice: number
  liquidationPrice: number
  markPrice: number
  markChange: string
  margin: number
  marginRate: string
}

defineProps<Props>()
defineEmits(['addReduce', 'takeProfitStopLoss', 'closePosition'])
</script>

<style scoped>
.card {
  background-color: #1E1E1E;
  border-radius: 20rpx;
  padding: 20rpx;
  color: #fff;
  margin: 20rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 24rpx;
}


.row-container {
  display: flex;
  flex-direction: column;
}

.column-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 15rpx;
}

.info {
  flex: 1;
  flex-direction: column;
}

.name {
  font-size: 30rpx;
  font-weight: bold;
}

.type {
  color: #999;
  font-size: 24rpx;
}

.badge {
  background: #222;
  border-radius: 10rpx;
  padding: 6rpx 12rpx;
  font-size: 22rpx;
}

.duration {
  display: flex;
  flex-direction: column;
  margin-left: auto;
  /* push this column to the far right */
  align-items: flex-end;
  text-align: right;
}

.bar {
  width: 120rpx;
  height: 8rpx;
  background-color: #333;
  border-radius: 4rpx;
  margin: 0 10rpx;
  position: relative;
}

.progress {
  height: 8rpx;
  background-color: #6f6af8;
  border-radius: 4rpx;
}

.summary {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}

.value {
  font-size: 32rpx;
  font-weight: bold;
}

.positive {
  color: #35d07f;
}

.divider {
  height: 1rpx;
  background-color: #333;
  margin: 15rpx 0;
}

.details .row {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  margin: 4rpx 0;
  color: #ccc;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25rpx;
}

.btn {
  flex: 1;
  margin: 0 6rpx;
  border-radius: 12rpx;
  padding: 12rpx 0;
  font-size: 28rpx;
  color: white;
  border: none;
}

.gradient-radial {
  background: linear-gradient(175deg, #5246a3, #d75b99);
}
</style>
