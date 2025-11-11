<template>
  <view 
    class="glass-card"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { hoverable: hoverable, elevated: elevated }
    ]"
    @tap="handleClick"
  >
    <view class="card-bg"></view>
    <view class="card-border"></view>
    
    <view class="card-header" v-if="$slots.header || title">
      <slot name="header">
        <text class="card-title">{{ title }}</text>
        <text v-if="subtitle" class="card-subtitle">{{ subtitle }}</text>
      </slot>
    </view>
    
    <view class="card-body">
      <slot></slot>
    </view>
    
    <view class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </view>
    
    <view class="card-glow"></view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'error' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  title?: string
  subtitle?: string
  hoverable?: boolean
  elevated?: boolean
}

interface Emits {
  (e: 'click', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  hoverable: false,
  elevated: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: Event) => {
  if (props.hoverable) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.glass-card {
  position: relative;
  border-radius: 24upx;
  overflow: hidden;
  backdrop-filter: blur(20upx);
  transition: all 0.3s ease;
  
  &.hoverable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4upx);
      
      .card-glow {
        opacity: 1;
      }
    }
    
    &:active {
      transform: translateY(-2upx);
    }
  }
  
  &.elevated {
    box-shadow: 
      0 10upx 30upx rgba(0, 0, 0, 0.1),
      0 4upx 8upx rgba(0, 0, 0, 0.05);
  }
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 0.3s ease;
}

.card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24upx;
  padding: 1upx;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 1upx;
    left: 1upx;
    right: 1upx;
    bottom: 1upx;
    border-radius: 23upx;
    background: rgba(255, 255, 255, 0.05);
  }
}

.card-header {
  position: relative;
  z-index: 2;
  margin-bottom: 24upx;
}

.card-title {
  display: block;
  font: $font-body-bold;
  color: $text-color-primary;
  margin-bottom: 8upx;
}

.card-subtitle {
  display: block;
  font: $font-caption-medium;
  color: $text-color-secondary;
}

.card-body {
  position: relative;
  z-index: 2;
  flex: 1;
}

.card-footer {
  position: relative;
  z-index: 2;
  margin-top: 24upx;
  padding-top: 24upx;
  border-top: 1upx solid rgba(255, 255, 255, 0.1);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgba(111, 75, 253, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

// 变体样式
.variant-default {
  .card-bg {
    background: rgba(255, 255, 255, 0.8);
  }
  
  .card-title {
    color: $neutral-900;
  }
  
  .card-subtitle {
    color: $neutral-600;
  }
}

.variant-primary {
  .card-bg {
    background: linear-gradient(135deg, rgba(111, 75, 253, 0.1) 0%, rgba(111, 75, 253, 0.05) 100%);
  }
  
  .card-border {
    background: linear-gradient(135deg, rgba(111, 75, 253, 0.3) 0%, rgba(111, 75, 253, 0.1) 100%);
  }
  
  .card-title {
    color: $primary-700;
  }
}

.variant-success {
  .card-bg {
    background: linear-gradient(135deg, rgba(25, 175, 0, 0.1) 0%, rgba(25, 175, 0, 0.05) 100%);
  }
  
  .card-border {
    background: linear-gradient(135deg, rgba(25, 175, 0, 0.3) 0%, rgba(25, 175, 0, 0.1) 100%);
  }
  
  .card-title {
    color: $success-700;
  }
}

.variant-error {
  .card-bg {
    background: linear-gradient(135deg, rgba(217, 42, 42, 0.1) 0%, rgba(217, 42, 42, 0.05) 100%);
  }
  
  .card-border {
    background: linear-gradient(135deg, rgba(217, 42, 42, 0.3) 0%, rgba(217, 42, 42, 0.1) 100%);
  }
  
  .card-title {
    color: $error-700;
  }
}

.variant-dark {
  .card-bg {
    background: linear-gradient(135deg, rgba(63, 63, 63, 0.9) 0%, rgba(33, 33, 33, 0.9) 100%);
  }
  
  .card-title {
    color: #ffffff;
  }
  
  .card-subtitle {
    color: rgba(255, 255, 255, 0.7);
  }
}

// 尺寸样式
.size-sm {
  padding: 24upx;
  
  .card-title {
    font-size: 28upx;
  }
  
  .card-subtitle {
    font-size: 22upx;
  }
}

.size-md {
  padding: 32upx;
  
  .card-title {
    font-size: 32upx;
  }
  
  .card-subtitle {
    font-size: 24upx;
  }
}

.size-lg {
  padding: 48upx;
  
  .card-title {
    font-size: 36upx;
  }
  
  .card-subtitle {
    font-size: 26upx;
  }
}
</style>
