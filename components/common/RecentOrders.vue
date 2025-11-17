<template>
  <view class="recent-orders">
    <view class="header">{{ t('discover.success.recent-order.title') }}</view>
    <view v-for="(item, index) in orders" :key="index" class="order-item">
      <view class="left">
        <view
          class="icon"
          :class="item.type === 'buy' ? 'long' : 'short'"
        >
          <text v-if="item.type === 'buy'">📈</text>
          <text v-else>📉</text>
        </view>
        <view class="info">
          <text class="pair">
            {{ item.type === 'buy' ? t('discover.success.recent-order.go-long') : t('discover.success.recent-order.to-short') }} {{ item.symbol }}
          </text>
          <text class="time">{{ item.time }}</text>
        </view>
      </view>

      <view
        class="pnl"
        :class="item.pnl >= 0 ? 'profit' : 'loss'"
      >
        {{ item.pnl >= 0 ? '+' : '' }}{{ item.pnl.toFixed(2) }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
import { defineProps } from 'vue'

defineProps<{
  orders: {
    type: 'buy' | 'sell'
    symbol: string
    time: string
    pnl: number
  }[]
}>()
</script>

<style scoped>
.recent-orders {
  background-color: #1c1c1e;
  border-radius: 12rpx;
  padding: 20rpx;
  color: #fff;
}
.header {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #2c2c2e;
}
.left {
  display: flex;
  align-items: center;
}
.icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  font-size: 32rpx;
}
.icon.long {
  background-color: rgba(0, 255, 0, 0.1);
  color: #00ff66;
}
.icon.short {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff4d4f;
}
.info .pair {
  font-size: 28rpx;
}
.info .time {
  font-size: 24rpx;
  color: #999;
}
.pnl {
  font-size: 28rpx;
  font-weight: 600;
}
.profit {
  color: #00ff66;
}
.loss {
  color: #ff4d4f;
}
</style>
