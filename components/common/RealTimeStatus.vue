<template>
  <view class="rt-card">
    <!-- title -->
    <text class="rt-title">{{ t('discover.success.realtime.title') }}</text>

    <!-- Following Trades row -->
    <view class="row-between">
      <text class="label">{{ t('discover.success.realtime.following-trader') }}</text>
      <text class="following-count">{{ followingTrades }}</text>
    </view>

    <!-- progress bar -->
    <view class="progress-wrap">
      <view class="progress-bg"></view>
      <view class="progress-fill" :style="{ width: progressWidth }"></view>
      <view class="progress-thumb" :style="{ left: thumbLeft }"></view>
    </view>

    <!-- current pnl box -->
    <view class="pnl-box">
      <view>
        <text class="pnl-title">{{ t('discover.success.realtime.current-pnl') }}</text>
        <text class="pnl-sub">{{ t('discover.success.realtime.return-rate') }}: {{ returnRate }}</text>
      </view>
      <text class="pnl-value" :class="{ positive: isPositivePnl }">
        {{ currentPnl }}
      </text>
    </view>

    <!-- Today's copy trades -->
    <view class="row-between mt">
      <text class="label">{{ t('discover.success.realtime.today-copy-trade') }}</text>
      <text class="value">{{ todaysCopyTrades }}</text>
    </view>

    <!-- Win rate -->
    <view class="row-between">
      <text class="label">{{ t('discover.success.realtime.win-rate') }}</text>
      <text class="value green">{{ winRate }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    followingTrades?: string | number
    progress?: number // 0 - 100
    currentPnl?: string
    returnRate?: string
    todaysCopyTrades?: string | number
    winRate?: string
  }>(),
  {
    followingTrades: '3笔',
    progress: 55,
    currentPnl: '+300USDT',
    returnRate: '+2.23%',
    todaysCopyTrades: 3,
    winRate: '66.7%'
  }
)

const progressWidth = computed(() => {
  const v = Math.max(0, Math.min(props.progress, 100))
  return v + '%'
})

// thumb sedikit ke kiri 16rpx biar ketengah
const thumbLeft = computed(() => {
  const v = Math.max(0, Math.min(props.progress, 100))
  return `calc(${v}% - 18rpx)`
})

const isPositivePnl = computed(() => props.currentPnl.trim().startsWith('+'))
</script>

<style scoped>
.rt-card {
  background: #1f2125;
  border-radius: 28rpx;
  padding: 26rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.rt-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 600;
}

.row-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #b1b6bf;
  font-size: 26rpx;
}

.following-count {
  color: #6153ff;
  font-size: 26rpx;
}

.progress-wrap {
  position: relative;
  height: 28rpx;
  margin: 6rpx 0 10rpx;
}

.progress-bg {
  background: #24243b;
  height: 100%;
  border-radius: 999rpx;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #7b5bff, #302e5a);
  border-radius: 999rpx;
}

.progress-thumb {
  position: absolute;
  top: -10rpx;
  width: 38rpx;
  height: 38rpx;
  background: #cfd1db;
  border-radius: 999rpx;
  border-width: 4rpx;
  border-style: solid;
  border-color: #7b5bff;
}

.pnl-box {
  background: #3b3d41;
  border-radius: 26rpx;
  padding: 20rpx 22rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.pnl-title {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  display: block;
}

.pnl-sub {
  color: #b1b6bf;
  font-size: 22rpx;
  margin-top: 8rpx;
}

.pnl-value {
  font-size: 30rpx;
  font-weight: 600;
  color: #e84b4b;
}

.pnl-value.positive {
  color: #27c367;
}

.mt {
  margin-top: 6rpx;
}

.value {
  color: #ffffff;
  font-size: 26rpx;
}

.green {
  color: #27c367;
}
</style>
