<template>
  <view class="card">
    <!-- Header -->
    <view class="header">
      <image class="avatar" :src="avatar" mode="aspectFill" />
      <view class="user-info">
        <text class="username">{{ username }}</text>
        <text class="followers">👤 {{ followers }}/{{ maxFollowers }}</text>
      </view>

      <view class="actions">
        <button class="btn-detail" @click="handleShowDetail">{{$t('discover.trader_detail') }}</button>
        <button class="btn-follow" @click="handleFollow">{{$t('discover.follow_trade') }}</button>
      </view>
    </view>

    <!-- Stats -->
    <view class="stats">
      <view class="col">
        <text class="label">{{$t('discover.thirty_day_profit')}}</text>
        <text class="value" :class="{ green: profitLoss > 0, red: profitLoss < 0 }">
          {{ profitLoss > 0 ? '+' : '' }}{{ profitLoss }}
        </text>
      </view>

      <view class="col">
        <text class="label">{{$t('discover.thirty_day_returns')}}</text>
        <text class="value" :class="{ green: returnRate > 0, red: returnRate < 0 }">
          {{ returnRate > 0 ? '+' : '' }}{{ returnRate }}%
        </text>
      </view>
    </view>

    <view class="stats">
      <view class="col">
        <text class="label">{{$t('discover.asset_management_scale')}}</text>
        <text class="value">{{ formatNumber(aum) }}</text>
      </view>

      <view class="col">
        <text class="label">{{$t('discover.sharpe_ratio')}}</text>
        <text class="value">{{ formatSharpe(sharpeRatio) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

export interface TraderCardProps {
  // User Info
  avatar?: string
  username: string
  followers: number
  maxFollowers: number
  
  // Performance Stats
  profitLoss: number  // 30天盈亏
  returnRate: number  // 30天收益率 (%)
  aum: number         // 资产管理规模 (Assets Under Management)
  sharpeRatio: number // 夏普比率
}

interface Emits {
  (e: 'detail'): void
  (e: 'follow'): void
}

const props = withDefaults(defineProps<TraderCardProps>(), {
  avatar: '/static/avatar.png',
  followers: 0,
  maxFollowers: 0,
  profitLoss: 0,
  returnRate: 0,
  aum: 0,
  sharpeRatio: 0
})

  function formatSharpe(val: any): string {
		const n = Number(val)
		if (!isFinite(n)) return '0.00'
		return n.toFixed(2)
	}

const emit = defineEmits<Emits>()

// Format large numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const handleShowDetail = () => {
  emit('detail')
}

const handleFollow = () => {
  emit('follow')
}
</script>

<style lang="scss" scoped>
.card {
  background: #2a2a2a;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
  margin-left: 5;
  margin-right: 5;
  color: #dcdcdc;
  font-size: 26rpx;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.2);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}

.followers {
  font-size: 24rpx;
  color: #9a9a9a;
  margin-top: 4rpx;
}

/* Actions */
.actions {
  display: flex;
  gap: 12rpx;
}

.btn-detail {
  border: 2rpx solid #666;
  color: #ccc;
  background-color: transparent;
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.btn-follow {
  background: linear-gradient(90deg, #7b61ff, #e87aa4);
  color: #fff;
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  border: none;
}

/* Stats */
.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.label {
  color: #9a9a9a;
  font-size: 24rpx;
}

.value {
  color: #e5e5e5;
  font-size: 28rpx;
  font-weight: 500;
}

.green {
  color: #4caf50;
}

.red {
  color: #f44336;
}
</style>