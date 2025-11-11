<template>
  <view class="portfolio-card" :style="{ background: gradientBg }">
    <view class="portfolio-header">
      <text class="portfolio-title">{{ title }}</text>
      <view class="portfolio-chart">
        <view class="chart-line"></view>
      </view>
    </view>
    
    <view class="portfolio-content">
      <view class="portfolio-amount">
        <text class="amount-value">{{ formatAmount(amount) }}</text>
        <view class="amount-change" :class="changeClass">
          <text class="change-icon">{{ changeIcon }}</text>
          <text class="change-text">{{ changeText }} in last {{ period }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  amount: number
  change: number
  period?: string
  gradientColors?: [string, string]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'My Portfolio',
  period: '7 days',
  gradientColors: () => ['#6f4bfd', '#ff6b9d']
})

// 格式化金额
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

// 渐变背景
const gradientBg = computed(() => {
  const [color1, color2] = props.gradientColors
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
})

// 涨跌幅样式类
const changeClass = computed(() => ({
  'positive': props.change > 0,
  'negative': props.change < 0
}))

// 涨跌幅图标
const changeIcon = computed(() => props.change > 0 ? '▲' : '▼')

// 涨跌幅文本
const changeText = computed(() => {
  const absChange = Math.abs(props.change)
  return `${absChange.toFixed(2)}%`
})
</script>

<style lang="scss" scoped>
.portfolio-card {
  position: relative;
  border-radius: 24upx;
  padding: 48upx 32upx;
  overflow: hidden;
  box-shadow: 0 20upx 60upx rgba(111, 75, 253, 0.3);
  backdrop-filter: blur(20upx);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
}

.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32upx;
}

.portfolio-title {
  color: rgba(255, 255, 255, 0.9);
  font: $font-body-medium;
  font-size: 28upx;
}

.portfolio-chart {
  width: 120upx;
  height: 60upx;
  position: relative;
}

.chart-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40upx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8upx;
  
  &::before {
    content: '';
    position: absolute;
    top: -10upx;
    right: 20upx;
    width: 80upx;
    height: 2upx;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2upx;
    transform: rotate(15deg);
  }
}

.portfolio-content {
  position: relative;
  z-index: 2;
}

.portfolio-amount {
  display: flex;
  flex-direction: column;
  gap: 16upx;
}

.amount-value {
  color: #ffffff;
  font: $font-heading-bold;
  font-size: 64upx;
  line-height: 1.2;
  text-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.3);
}

.amount-change {
  display: flex;
  align-items: center;
  gap: 8upx;
}

.change-icon {
  font-size: 24upx;
  
  .positive & {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .negative & {
    color: rgba(255, 255, 255, 0.7);
  }
}

.change-text {
  color: rgba(255, 255, 255, 0.8);
  font: $font-caption-medium;
  font-size: 24upx;
}
</style>
