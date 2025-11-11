<template>
  <view class="coin-icon" :class="{ large: size === 'large' }">
    <image 
      v-if="src" 
      :src="src" 
      class="icon-image"
      :alt="symbol"
      @error="handleError"
    />
    <view v-else class="icon-placeholder">
      {{ symbol?.slice(0, 2).toUpperCase() }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  symbol: string
  size?: 'small' | 'medium' | 'large'
  src?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const hasError = ref(false)

// 计算图标源地址
const src = computed(() => {
  if (props.src) return props.src
  if (hasError.value) return ''
  
  // 默认使用通用的币种图标API
  return `https://assets.coincap.io/assets/icons/${props.symbol.toLowerCase()}@2x.png`
})

const handleError = () => {
  hasError.value = true
}
</script>

<style lang="scss" scoped>
.coin-icon {
  width: 48upx;
  height: 48upx;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $uni-bg-color-grey;
  
  &.large {
    width: 80upx;
    height: 80upx;
  }
  
  .icon-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .icon-placeholder {
    font-size: 20upx;
    font-weight: 500;
    color: $uni-text-color-secondary;
    
    .large & {
      font-size: 32upx;
    }
  }
}
</style>
