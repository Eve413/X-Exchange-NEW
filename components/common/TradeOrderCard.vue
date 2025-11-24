<template>
  <view class="order-card">
    <!-- Header -->
    <view class="divider"></view>
    <view class="header">
      <text class="order">{{ t('trade-page.current-order-card.one') }}：{{ orderId }}</text>
      <text class="time">{{ date }}</text>
    </view>

    <!-- Asset Info -->
    <view class="asset">
      <image class="icon" :src="icon" mode="aspectFit" />
      <view class="info">
        <view class="row">
          <view class="column">
            <view class="row">
              <text class="name">{{ name }}</text>
              <text class="type">{{ typeAsset }}</text>
              <view class="leverage">
                <text>{{ leverage }}</text>
              </view>
            </view>
            <text class="type">{{ type }}</text>
          </view>
          <view class="column-right">
            <view class="left">
              <text>{{ duration }}</text>
            </view>
            <view class="right">
              <view class="bar">
                <view class="progress" :style="{ width: progress + '%' }"></view>
              </view>

            </view>
            <text class="percent">{{ progress }}%</text>
          </view>

        </view>
      </view>

    </view>

    <!-- Duration -->


    <!-- Order info -->
    <view class="info-section">
      <view class="info-item">
        <text class="label">{{ t('trade-page.current-order-card.two') }}</text>
        <view class="value editable">
          <text>{{ price }}</text>
          <image class="icon-small" src="/static/icons/trade/ic_write_pen.png" mode="aspectFit" />
        </view>
      </view>

      <view class="info-item">
        <text class="label">{{ t('trade-page.current-order-card.three') }}</text>
        <view class="value editable">
          <text>{{ quantity }}</text>
          <image class="icon-small" src="/static/icons/trade/ic_write_pen.png" mode="aspectFit" />
        </view>
      </view>

      <view class="info-item">
        <text class="label">{{ t('trade-page.current-order-card.four') }}</text>
        <view class="value editable">
          <text>{{ amount }}</text>
          <image class="icon-small" src="/static/icons/trade/ic_write_pen.png" mode="aspectFit" />
        </view>
      </view>

      <button class="btn-cancel" @click="$emit('cancelOrder', orderId)">{{ t('trade-page.current-order-card.five') }}</button>
    </view>
  </view>
  <view class="divider"></view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

interface Props {
  orderId: string
  date: string
  icon: string
  name: string
  type: string
  typeAsset: string
  leverage: string
  duration: string
  progress: number
  price: number
  quantity: number
  amount: number
}
defineProps<Props>()
defineEmits(['cancelOrder'])
</script>

<style scoped>
.order-card {
  background-color: #121212;
  border-radius: 20rpx;
  padding: 20rpx;
  color: #fff;
  margin-bottom: 20rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
}

.divider {
  height: 1rpx;
  background-color: #333;
  margin: 15rpx 0;
}

.header {
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: 24rpx;
}

.icon-small {
  width: 28rpx;
  height: 28rpx;
  opacity: 1;
  margin-right: 8rpx;
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
}

.row {
  display: flex;
  flex-direction: row;
  width: 100%;
  /* allow pushing items to the far right */
}

.column {
  display: flex;
  flex-direction: column;
}

/* Right-side column: align everything to the right edge */
.column-right {
  display: flex;
  flex-direction: column;
  margin-left: auto;
  /* push this column to the far right */
  align-items: flex-end;
  text-align: right;
}

/* Ensure the progress line and percent are aligned on the right */
.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10rpx;
}

.name {
  font-size: 30rpx;
  font-weight: bold;
}

.type {
  color: #999;
  font-size: 24rpx;
}

.leverage {
  font-size: 24rpx;
  color: #aaa;
}

.duration {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #a0a4a8;
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

.percent {
  font-size: 22rpx;
}

.info-section {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  /* spread items across full width */
  gap: 20rpx;
  /* consistent spacing between items */
  margin-top: 20rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  /* allow each info block to grow equally */
  color: #ccc;
  font-size: 24rpx;
}

.value {
  margin-top: 8rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: #fff;
}

.editable text {
  font-weight: bold;
}

.btn-cancel {
  background: linear-gradient(175deg, #5246a3, #d75b99);
  border: none;
  color: #fff;
  border-radius: 12rpx;
  padding: 12rpx 30rpx;
  font-size: 28rpx;
  text-align: center;
}
</style>
