<template>
  <view class="network-monitor" v-if="!appStore.isOnline">
    <view class="network-monitor__content">
      <text class="iconfont icon-wifi-off"></text>
      <text class="network-monitor__text">网络连接已断开</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.network-monitor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background-color: $uni-color-error;
  color: #ffffff;
  text-align: center;
  padding: 20upx;
  font-size: 26upx;

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__text {
    margin-left: 16upx;
  }

  .iconfont {
    font-size: 28upx;
  }
}
</style> 