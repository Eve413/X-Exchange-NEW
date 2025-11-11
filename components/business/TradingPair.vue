<template>
  <view class="trading-pair" @tap="handleClick">
    <view class="trading-pair__header">
      <view class="trading-pair__symbol">
        <text class="trading-pair__base">{{ pair.baseAsset }}</text>
        <text class="trading-pair__quote">/{{ pair.quoteAsset }}</text>
      </view>
      <view class="trading-pair__volume">
        <text class="trading-pair__volume-label">24H量</text>
        <text class="trading-pair__volume-value">{{ formatVolume(pair.volume) }}</text>
      </view>
    </view>
    
    <view class="trading-pair__body">
      <view class="trading-pair__price">
        <text class="trading-pair__current-price" :class="priceClass">
          {{ formatPrice(pair.lastPrice) }}
        </text>
        <text class="trading-pair__price-currency">{{ pair.quoteAsset }}</text>
      </view>
      
      <view class="trading-pair__change" :class="changeClass">
        <text class="trading-pair__change-percent">{{ formatChange(pair.priceChangePercent) }}</text>
        <text class="trading-pair__change-amount">{{ formatPriceChange(pair.priceChange) }}</text>
      </view>
    </view>
    
    <view class="trading-pair__chart" v-if="showChart">
      <!-- TODO: MiniChart组件待开发 -->
      <view class="chart-placeholder">
        <text class="chart-placeholder-text">图表组件开发中...</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { NumberFormat } from '@/utils/format'
import { computed } from 'vue'
// TODO: MiniChart组件待开发
// import MiniChart from './MiniChart.vue'

export interface TradingPairData {
  symbol: string
  baseAsset: string
  quoteAsset: string
  lastPrice: number
  priceChange: number
  priceChangePercent: number
  volume: number
  high24h: number
  low24h: number
  chartData?: number[]
}

interface Props {
  pair: TradingPairData
  showChart?: boolean
  chartType?: 'line' | 'candle'
}

interface Emits {
  (e: 'click', pair: TradingPairData): void
}

const props = withDefaults(defineProps<Props>(), {
  showChart: true,
  chartType: 'line'
})

const emit = defineEmits<Emits>()

// 计算属性
const priceClass = computed(() => {
  const change = props.pair.priceChangePercent
  return {
    'trading-pair__current-price--up': change > 0,
    'trading-pair__current-price--down': change < 0,
    'trading-pair__current-price--neutral': change === 0
  }
})

const changeClass = computed(() => {
  const change = props.pair.priceChangePercent
  return {
    'trading-pair__change--up': change > 0,
    'trading-pair__change--down': change < 0,
    'trading-pair__change--neutral': change === 0
  }
})

// 格式化方法
const formatPrice = (price: number) => {
  return NumberFormat.formatNumber(price, 4)
}

const formatVolume = (volume: number) => {
  return NumberFormat.formatVolume(volume)
}

const formatChange = (change: number) => {
  return NumberFormat.formatChange(change)
}

const formatPriceChange = (change: number) => {
  const sign = change > 0 ? '+' : ''
  return `${sign}${NumberFormat.formatNumber(change, 4)}`
}

// 事件处理
const handleClick = () => {
  emit('click', props.pair)
}
</script>

<style lang="scss" scoped>
.trading-pair {
  background-color: $uni-bg-color;
  border-radius: $uni-border-radius-base;
  padding: $uni-spacing-base;
  margin-bottom: $uni-spacing-sm;
  border: 1upx solid $uni-border-color;
  transition: all 0.3s ease;

  &:active {
    background-color: $uni-bg-color-hover;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $uni-spacing-sm;
  }

  &__symbol {
    display: flex;
    align-items: baseline;
  }

  &__base {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    color: $uni-text-color;
  }

  &__quote {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-secondary;
    margin-left: 4upx;
  }

  &__volume {
    text-align: right;

    &-label {
      display: block;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-secondary;
    }

    &-value {
      display: block;
      font-size: $uni-font-size-sm;
      color: $uni-text-color;
      margin-top: 4upx;
    }
  }

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $uni-spacing-sm;
  }

  &__price {
    display: flex;
    align-items: baseline;
  }

  &__current-price {
    font-size: 32upx;
    font-weight: bold;
    
    &--up {
      color: $exchange-color-buy;
    }
    
    &--down {
      color: $exchange-color-sell;
    }
    
    &--neutral {
      color: $uni-text-color;
    }
  }

  &__price-currency {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-secondary;
    margin-left: 8upx;
  }

  &__change {
    text-align: right;
    
    &--up {
      color: $exchange-color-buy;
    }
    
    &--down {
      color: $exchange-color-sell;
    }
    
    &--neutral {
      color: $uni-text-color;
    }
  }

  &__change-percent {
    display: block;
    font-size: $uni-font-size-base;
    font-weight: bold;
  }

  &__change-amount {
    display: block;
    font-size: $uni-font-size-sm;
    margin-top: 4upx;
  }

  &__chart {
    height: 120upx;
    margin-top: $uni-spacing-sm;
  }
}

// 图表占位符样式
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgba(111, 75, 253, 0.05);
  border-radius: $uni-border-radius-sm;
  border: 1upx dashed rgba(111, 75, 253, 0.3);
  
  &-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-secondary;
  }
}
</style> 