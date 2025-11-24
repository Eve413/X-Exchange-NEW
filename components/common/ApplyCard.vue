<template>
  <view class="content">
    <view class="apply-card" @tap="$emit('tap')">
      <view class="apply-left">
        <text class="apply-title">{{ title }}</text>
        <text class="apply-link">{{ linkText }}</text>
      </view>
     <image class="apply-art-img" src="/static/icons/trade/ic_header_trader.png" mode="aspectFit" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
/**
 * Props: agar bisa digunakan fleksibel
 */
defineProps<{
  title: string
  linkText: string
  image: string
}>()

/**
 * Event: "tap" dikirim ke parent bila kartu diklik
 */
defineEmits(['tap'])
</script>

<style scoped>
/* Content wrapper below fixed header */
.content {
  padding: 140rpx 24rpx 0 24rpx; /* header height offset */
}

/* Apply card styles */
.apply-card {
  background: #1a1c1f;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 24rpx;
  border-width: 2rpx;
  border-style: solid;
  border-color: #2a2d33;
}

.apply-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.apply-title {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
}

.apply-link {
  color: #8ab4f8;
  font-size: 24rpx;
}

/* Simple CSS illustration to mimic the design */
/* Replace illustration with static image */
.apply-art-img {
  width: 180rpx;
  height: 120rpx;
  flex-shrink: 0;
}
</style>
