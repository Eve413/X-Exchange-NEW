<template>
  <view class="airdrop-card">
    <!-- Header -->
    <view class="top">
      <view class="left">
        <view class="icon-box" :style="{ backgroundColor: iconBgColor }">
          <image v-if="icon && icon.startsWith('http')" :src="icon" mode="aspectFit" class="icon-image" />
        </view>
        <view class="token-info">
          <text class="token-name">{{ tokenName }}</text>
          <text class="token-amount">{{ tokenAmount }}</text>
        </view>
      </view>

      <view class="status" :class="statusClass">{{ statusText }}</view>
    </view>

    <!-- Middle -->
    <view class="middle">
      <text class="participants">参与人数: {{ formatNumber(participants) }}</text>
      <text class="countdown" v-if="countdown">{{ countdown }}</text>
    </view>

    <!-- Bottom -->
    <view class="bottom">
      <button class="join-btn" @click="handleJoin" :disabled="isEnded">
        {{ buttonText }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface AirdropCardProps {
  // Token Information
  icon?: string              // Emoji or icon
  iconBgColor?: string       // Icon background color
  tokenName: string          // Token name (e.g., 'PAWS')
  tokenAmount: string        // Amount (e.g., '500,000 PROMPT')
  
  // Status
  status: 'ongoing' | 'upcoming' | 'ended'  // Airdrop status
  
  // Statistics
  participants: number       // Number of participants
  countdown?: string         // Countdown timer (e.g., '4d 15:23:11')
  
  // Button
  buttonText?: string        // Custom button text
}

interface Emits {
  (e: 'join'): void
}

const props = withDefaults(defineProps<AirdropCardProps>(), {
  icon: '🎁',
  iconBgColor: '#8b5cf6',
  participants: 0,
  countdown: '',
  buttonText: '加入空投'
})

const emit = defineEmits<Emits>()

// Computed status class
const statusClass = computed(() => {
  switch (props.status) {
    case 'ongoing':
      return 'status-ongoing'
    case 'upcoming':
      return 'status-upcoming'
    case 'ended':
      return 'status-ended'
    default:
      return ''
  }
})

// Computed status text
const statusText = computed(() => {
  switch (props.status) {
    case 'ongoing':
      return '进行中'
    case 'upcoming':
      return '即将开始'
    case 'ended':
      return '已结束'
    default:
      return ''
  }
})

// Check if airdrop has ended
const isEnded = computed(() => props.status === 'ended')

// Format large numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

// Handle join button click
const handleJoin = () => {
  if (!isEnded.value) {
    emit('join')
  }
}
</script>

<style lang="scss" scoped>
.airdrop-card {
  background-color: #1f1f1f;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 20rpx;
  color: #ffffff;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
}

/* Header */
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
}

.icon-box {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background-color: #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.token-info {
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
}

.token-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}

.token-amount {
  font-size: 26rpx;
  color: #8b5cf6;
  margin-top: 4rpx;
}

.status {
  font-size: 24rpx;
  padding: 4rpx 14rpx;
  border-radius: 10rpx;
}

.status-ongoing {
  background-color: #1b5e20;
  color: #b9f6ca;
}

.status-upcoming {
  background-color: #1a237e;
  color: #82b1ff;
}

.status-ended {
  background-color: #424242;
  color: #bdbdbd;
}

/* Middle */
.middle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.participants {
  color: #bdbdbd;
  font-size: 26rpx;
}

.countdown {
  color: #ef5350;
  font-size: 26rpx;
}

/* Bottom */
.bottom {
  margin-top: 24rpx;
}

.join-btn {
  width: 100%;
  height: 72rpx;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(90deg, #7b61ff, #e87aa4);
}
</style>
