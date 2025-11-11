<template>
  <view class="loading-container" :class="{ fullscreen: fullscreen }">
    <view class="loading-content">
      <view class="spinner" :class="{ large: size === 'large' }">
        <view class="spinner-ring"></view>
      </view>
      <text v-if="text" class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  size?: 'small' | 'medium' | 'large'
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  fullscreen: false
})
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .loading-text {
    margin-top: $uni-spacing-base;
    font-size: $uni-font-size-base;
    color: $uni-text-color-secondary;
  }
}

.spinner {
  width: 40upx;
  height: 40upx;
  
  &.large {
    width: 60upx;
    height: 60upx;
  }
  
  .spinner-ring {
    width: 100%;
    height: 100%;
    border: 3upx solid $uni-bg-color-grey;
    border-top: 3upx solid $uni-color-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
