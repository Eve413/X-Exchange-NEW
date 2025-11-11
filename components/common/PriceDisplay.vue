<template>
  <view class="price-display" :class="{ animated: animated && hasChanged }">
    <text class="price-value" :class="priceClass">
      {{ formattedPrice }}
    </text>
    <text v-if="currency" class="price-currency">{{ currency }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  value: number | string
  currency?: string
  precision?: number
  animated?: boolean
  trend?: 'up' | 'down' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  precision: 2,
  animated: false,
  trend: 'neutral'
})

const previousValue = ref<number>(0)
const hasChanged = ref(false)

// 格式化价格显示
const formattedPrice = computed(() => {
  const numValue = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  
  if (isNaN(numValue)) return '0.00'
  
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision
  })
})

// 价格变化样式
const priceClass = computed(() => {
  const numValue = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  
  if (props.trend === 'up' || (props.animated && numValue > previousValue.value)) {
    return 'price-up'
  }
  
  if (props.trend === 'down' || (props.animated && numValue < previousValue.value)) {
    return 'price-down'
  }
  
  return 'price-neutral'
})

// 监听价格变化
watch(() => props.value, (newValue, oldValue) => {
  if (props.animated) {
    const newNum = typeof newValue === 'string' ? parseFloat(newValue) : newValue
    const oldNum = typeof oldValue === 'string' ? parseFloat(oldValue) : oldValue
    
    if (newNum !== oldNum) {
      previousValue.value = oldNum
      hasChanged.value = true
      
      // 动画效果持续时间
      setTimeout(() => {
        hasChanged.value = false
      }, 1000)
    }
  }
})
</script>

<style lang="scss" scoped>
.price-display {
  display: inline-flex;
  align-items: baseline;
  gap: 4upx;
  
  &.animated {
    transition: all 0.3s ease;
  }
  
  .price-value {
    font-family: 'Consolas', 'Monaco', monospace;
    font-weight: 500;
    
    &.price-up {
      color: $exchange-color-buy;
    }
    
    &.price-down {
      color: $exchange-color-sell;
    }
    
    &.price-neutral {
      color: $uni-text-color;
    }
  }
  
  .price-currency {
    font-size: 0.9em;
    color: $uni-text-color-secondary;
    font-weight: normal;
  }
}

// 价格闪烁动画
.price-display.animated .price-value {
  &.price-up {
    animation: flash-up 0.6s ease-in-out;
  }
  
  &.price-down {
    animation: flash-down 0.6s ease-in-out;
  }
}

@keyframes flash-up {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(0, 200, 83, 0.2);
  }
}

@keyframes flash-down {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(244, 67, 54, 0.2);
  }
}
</style>
