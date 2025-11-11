<template>
  <view class="app-toast" v-if="appStore.toastVisible">
    <view 
      class="app-toast__content"
      :class="[`app-toast__content--${appStore.toastType}`]"
    >
      <view class="app-toast__icon">
        <text class="iconfont" :class="iconClass"></text>
      </view>
      <text class="app-toast__message">{{ appStore.toastMessage }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const iconClass = computed(() => {
  const iconMap = {
    success: 'icon-success',
    error: 'icon-error',
    warning: 'icon-warning',
    info: 'icon-info'
  }
  return iconMap[appStore.toastType] || 'icon-info'
})
</script>

<style lang="scss" scoped>
.app-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  pointer-events: none;

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200upx;
    max-width: 500upx;
    padding: 24upx 32upx;
    background-color: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    border-radius: 12upx;
    font-size: 28upx;
    
    &--success {
      .app-toast__icon {
        color: $uni-color-success;
      }
    }
    
    &--error {
      .app-toast__icon {
        color: $uni-color-error;
      }
    }
    
    &--warning {
      .app-toast__icon {
        color: $uni-color-warning;
      }
    }
    
    &--info {
      .app-toast__icon {
        color: $uni-color-primary;
      }
    }
  }

  &__icon {
    margin-right: 16upx;
    font-size: 32upx;
  }

  &__message {
    flex: 1;
    text-align: center;
    word-break: break-all;
  }
}
</style> 