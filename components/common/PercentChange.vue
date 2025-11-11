<template>
    <view class="percent-change" :class="changeClass">
        <text class="change-text">
            {{ formattedValue }}
        </text>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number
  showSign?: boolean
  precision?: number
}

const props = withDefaults(defineProps<Props>(), {
  showSign: true,
  precision: 2
})

// 计算变化类型
const changeClass = computed(() => {
  if (props.value > 0) return 'rise'
  if (props.value < 0) return 'fall'
  return 'neutral'
})

// 格式化显示值
const formattedValue = computed(() => {
  const absValue = Math.abs(props.value)
  const formatted = absValue
  
  if (props.value === 0) {
    return `${formatted}%`
  }
  
  if (props.showSign) {
    const sign = props.value > 0 ? '+' : '-'
    return `${sign}${formatted}%`
  }
  
  return `${formatted}%`
})
</script>

<style lang="scss" scoped>
.percent-change {
    display: inline-flex;
    align-items: center;
    padding: 4upx 8upx;
    border-radius: $uni-border-radius-sm;
    font-size: $uni-font-size-sm;
    font-weight: 500;

    &.rise {
        color: $exchange-color-buy;
        background: rgba(0, 200, 83, 0.1);
    }

    &.fall {
        color: $exchange-color-sell;
        background: rgba(244, 67, 54, 0.1);
    }

    &.neutral {
        color: $uni-text-color-secondary;
        background: $uni-bg-color-grey;
    }

    .change-text {
        line-height: 1;
    }
}
</style>
