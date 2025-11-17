<template>
  <view class="copy-settings">
    <text class="title">{{ t('discover.success.setting.title') }}</text>

    <!-- Copy Amount -->
    <view class="row">
      <text class="label">{{ t('discover.success.setting.amount') }}:</text>
      <text class="value">{{ copyAmount }}</text>
    </view>

    <!-- Stop Loss Ratio -->
    <view class="row">
      <text class="label">{{ t('discover.success.setting.stop-loss-ratio') }}:</text>
      <text class="value danger">{{ stopLoss }}</text>
    </view>

    <!-- Take Profit Ratio -->
    <view class="row">
      <text class="label">{{ t('discover.success.setting.take-profit-ratio') }}:</text>
      <text class="value success">{{ takeProfit }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const props = withDefaults(defineProps<{
  copyAmount?: string
  stopLoss?: string
  takeProfit?: string
}>(), {
  copyAmount: '1,000 USDT',
  stopLoss: '-20%',
  takeProfit: '+50%'
})
</script>

<style scoped>
.copy-settings {
  background: #1f2125;
  border-radius: 28rpx;
  padding: 26rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.row {
  background: #3b3d41;
  border-radius: 26rpx;
  padding: 26rpx 26rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #c8ced6;
  font-size: 26rpx;
}

.value {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.danger {
  color: #e84b4b;
}

.success {
  color: #23c15a;
}
</style>
