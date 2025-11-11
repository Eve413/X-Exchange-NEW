<template>
  <button 
    class="glass-button"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { disabled: disabled, loading: loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <view class="button-bg"></view>
    <view class="button-content">
      <view v-if="loading" class="loading-spinner"></view>
      <view v-else-if="icon" class="button-icon">{{ icon }}</view>
      <text class="button-text">
        <slot>{{ text }}</slot>
      </text>
    </view>
    <view class="button-glow"></view>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  icon?: string
  disabled?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'click', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  text: '',
  disabled: false,
  loading: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.glass-button {
  position: relative;
  border: none;
  border-radius: 16upx;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(20upx);
  border: 1upx solid rgba(255, 255, 255, 0.2);
  
  &:hover:not(.disabled) {
    transform: translateY(-2upx);
    
    .button-glow {
      opacity: 1;
    }
  }
  
  &:active:not(.disabled) {
    transform: translateY(0);
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    .button-bg {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  }
}

.button-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 0.3s ease;
}

.button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12upx;
  z-index: 2;
}

.button-icon {
  font-size: 32upx;
  line-height: 1;
}

.button-text {
  font: $font-body-medium;
  line-height: 1;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.loading-spinner {
  width: 32upx;
  height: 32upx;
  border: 3upx solid rgba(255, 255, 255, 0.3);
  border-top: 3upx solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 变体样式
.variant-primary {
  .button-bg {
    background: $gradient-primary;
  }
  
  .button-text, .button-icon {
    color: #ffffff;
  }
}

.variant-secondary {
  .button-bg {
    background: rgba(63, 63, 63, 0.8);
  }
  
  .button-text, .button-icon {
    color: #ffffff;
  }
}

.variant-success {
  .button-bg {
    background: $gradient-success;
  }
  
  .button-text, .button-icon {
    color: #ffffff;
  }
}

.variant-error {
  .button-bg {
    background: linear-gradient(135deg, #d92a2a 0%, #ff6b6b 100%);
  }
  
  .button-text, .button-icon {
    color: #ffffff;
  }
}

.variant-ghost {
  .button-bg {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .button-text, .button-icon {
    color: $primary-500;
  }
}

// 尺寸样式
.size-sm {
  padding: 16upx 24upx;
  border-radius: 12upx;
  
  .button-text {
    font-size: 24upx;
  }
  
  .button-icon {
    font-size: 28upx;
  }
}

.size-md {
  padding: 24upx 32upx;
  border-radius: 16upx;
  
  .button-text {
    font-size: 28upx;
  }
  
  .button-icon {
    font-size: 32upx;
  }
}

.size-lg {
  padding: 32upx 48upx;
  border-radius: 20upx;
  
  .button-text {
    font-size: 32upx;
  }
  
  .button-icon {
    font-size: 36upx;
  }
}
</style>
