<template>
  <view class="trader-card">
    <!-- header title -->
    <text class="card-title">{{ t('discover.success.trader-info.title') }}</text>

    <!-- top row: avatar, name, followers, status -->
    <view class="top-row">
      <view class="left">
        <image
          class="avatar"
          :src="avatar"
          mode="aspectFill"
        />
        <view class="info">
          <text class="name">{{ name }}</text>
          <view class="followers">
            <text class="followers-icon">👥</text>
            <text class="followers-text">{{ followers }} {{ t('discover.success.trader-info.followers') }}</text>
          </view>
        </view>
      </view>

      <view v-if="status" class="status-badge" :class="{ active: status === t('discover.success.trader-info.active') }">
        <text>{{ status }}</text>
      </view>
    </view>

    <!-- 30-day return rate -->
    <view class="row-between mt">
      <text class="label">{{ t('discover.success.trader-info.day-return-rate') }}</text>
      <text class="value green">{{ returnRate }}</text>
    </view>

    <!-- AUM -->
    <view class="row-between mt-sm">
      <text class="label">{{ t('discover.success.trader-info.aum') }}</text>
      <text class="value">{{ aum }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">

import { defineProps, withDefaults } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const props = withDefaults(defineProps<{
  avatar?: string
  name?: string
  followers?: string | number
  status?: string
  returnRate?: string
  aum?: string
}>(), {
  avatar: 'https://via.placeholder.com/80',
  name: 'Alice',
  followers: '980',
  status: 'Active',
  returnRate: '101.86%',
  aum: '2.113,255.27'
})
</script>

<style scoped>
.trader-card {
  background: #1f2125;
  border-radius: 26rpx;
  padding: 26rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.card-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.top-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
  align-items: center;
}

.avatar {
  width: 86rpx;
  height: 86rpx;
  border-radius: 50%;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.name {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 500;
}

.followers {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}

.followers-icon {
  font-size: 24rpx;
}

.followers-text {
  color: #aeb5c1;
  font-size: 24rpx;
}

.status-badge {
  background: #3b3d41;
  padding: 6rpx 28rpx;
  border-radius: 999rpx;
}

.status-badge.active {
  background: #265d2f;
}

.status-badge text {
  color: #ffffff;
  font-size: 24rpx;
}

.row-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.mt {
  margin-top: 26rpx;
}

.mt-sm {
  margin-top: 18rpx;
}

.label {
  color: #aeb5c1;
  font-size: 26rpx;
}

.value {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
}

.green {
  color: #27c367;
}
</style>
