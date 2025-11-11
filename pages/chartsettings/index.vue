<template>
  <view class="settings-page">
    <!-- Header -->
    <view class="settings-header">
      <image src="/static/icons/ic_arrow_left.png" class="icon" @click="goBack"  />
      <text class="settings-title">{{ $t('chart_settings') }}</text>
    </view>

    <!-- List Item -->
    <view class="settings-list">
      <view 
        v-for="(item, index) in settings" 
        :key="index"
        class="settings-item"
        @click="onItemClick(item)"
      >
        <text class="item-label">{{ item.label }}</text>
        <view class="item-right">
          <text class="item-value">{{ item.value }}</text>
          <text class="arrow">{{ '▼' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const settings = ref([
  { label: t('theme_mode'), value:  t('dark_mode') },
  { label: t('kline_style'), value: t('solid') },
  { label: t('rise_fall_preference'), value: t('green_up_red_down') },
  { label: t('indicator_settings'), value: '' }
])

const onItemClick = (item) => {
  console.log('Clicked:', item.label)
  // Tambahkan navigasi ke halaman detail di sini
}
// ✅ Fungsi kembali
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.settings-page {
  background-color: #1e1e1e;
  min-height: 100vh;
  padding: 0 30rpx;
  color: #fff;
  font-family: 'PingFang SC', sans-serif;
}

/* ✅ Header rapi dan sejajar vertikal */
.settings-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100rpx;
  margin-bottom: 40rpx;
  padding-top: 50rpx;
}

.icon {
  position: absolute;
  left: 0;
  width: 40rpx;
  height: 32rpx;
}

.settings-title {
  font-size: 38rpx;
  font-weight: bold;
  text-align: center;
}

/* ✅ List style */
.settings-list {
  display: flex;
  flex-direction: column;
  /* gap: 25rpx; */
}

.settings-item {
  background-color: #2a2a2a;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 25rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.settings-item:active {
  background-color: #383838;
}

.item-label {
  font-size: 30rpx;
  color: #f3f3f3;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.item-value {
  font-size: 28rpx;
  color: #b3b3b3;
}

.arrow {
  font-size: 20rpx;
  color: #b3b3b3;
}
</style>
