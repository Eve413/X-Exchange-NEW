# 使用示例

本文档提供X交易所设计系统的实际应用示例，帮助开发者快速上手使用现代UI组件库。

## 🏠 首页示例

### 投资组合概览页面
```vue
<template>
  <view class="portfolio-overview">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">我的投资组合</text>
      <Icon name="refresh" size="md" color="primary" clickable @click="refreshData" />
    </view>
    
    <!-- 投资组合卡片 -->
    <PortfolioCard
      title="总资产价值"
      :amount="totalAssets"
      :change="dailyChange"
      period="今日"
      :gradient-colors="['#6f4bfd', '#ff6b9d']"
      class="portfolio-main-card"
    />
    
    <!-- 快捷操作 -->
    <view class="quick-actions">
      <GlassCard size="sm" hoverable @click="navigateToTrade">
        <view class="action-item">
          <Icon name="stats-up-square" size="lg" color="primary" />
          <text class="action-text">开始交易</text>
        </view>
      </GlassCard>
      
      <GlassCard size="sm" hoverable @click="navigateToMarket">
        <view class="action-item">
          <Icon name="graph-up" size="lg" color="success" />
          <text class="action-text">查看行情</text>
        </view>
      </GlassCard>
      
      <GlassCard size="sm" hoverable @click="navigateToAssets">
        <view class="action-item">
          <Icon name="wallet" size="lg" color="warning" />
          <text class="action-text">资产管理</text>
        </view>
      </GlassCard>
    </view>
    
    <!-- 持仓概览 -->
    <GlassCard 
      variant="default" 
      size="md" 
      title="持仓资产"
      subtitle="按价值排序"
      class="holdings-card"
    >
      <view class="holdings-list">
        <view 
          v-for="holding in holdings" 
          :key="holding.symbol"
          class="holding-item"
        >
          <view class="holding-info">
            <text class="holding-symbol">{{ holding.symbol }}</text>
            <text class="holding-name">{{ holding.name }}</text>
          </view>
          <view class="holding-value">
            <text class="holding-amount">${{ formatNumber(holding.value) }}</text>
            <text 
              class="holding-change"
              :class="{ 
                'positive': holding.change > 0,
                'negative': holding.change < 0 
              }"
            >
              {{ holding.change > 0 ? '+' : '' }}{{ holding.change.toFixed(2) }}%
            </text>
          </view>
        </view>
      </view>
      
      <template #footer>
        <GlassButton variant="ghost" size="sm" @click="viewAllHoldings">
          查看全部资产
        </GlassButton>
      </template>
    </GlassCard>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PortfolioCard, GlassCard, GlassButton, Icon } from '@/components/ui'

// 数据
const totalAssets = ref(125683.45)
const dailyChange = ref(8.97)

const holdings = ref([
  { symbol: 'BTC', name: 'Bitcoin', value: 45623.12, change: 3.45 },
  { symbol: 'ETH', name: 'Ethereum', value: 23456.78, change: -1.23 },
  { symbol: 'BNB', name: 'Binance Coin', value: 8934.56, change: 5.67 }
])

// 方法
const refreshData = () => {
  console.log('刷新数据')
}

const navigateToTrade = () => {
  uni.navigateTo({ url: '/pages/trade/index' })
}

const navigateToMarket = () => {
  uni.navigateTo({ url: '/pages/market/index' })
}

const navigateToAssets = () => {
  uni.navigateTo({ url: '/pages/assets/index' })
}

const viewAllHoldings = () => {
  console.log('查看全部持仓')
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}
</script>

<style lang="scss" scoped>
.portfolio-overview {
  padding: 24upx;
  background: $neutral-50;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32upx;
}

.page-title {
  font: $font-heading-bold;
  color: $neutral-900;
}

.portfolio-main-card {
  margin-bottom: 32upx;
  box-shadow: 0 20upx 60upx rgba(111, 75, 253, 0.2);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16upx;
  margin-bottom: 32upx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12upx;
  padding: 24upx 16upx;
}

.action-text {
  font: $font-caption-medium;
  color: $neutral-700;
  text-align: center;
}

.holdings-card {
  box-shadow: $shadow-md;
}

.holdings-list {
  display: flex;
  flex-direction: column;
  gap: 16upx;
}

.holding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16upx 0;
  border-bottom: 1upx solid $neutral-200;
  
  &:last-child {
    border-bottom: none;
  }
}

.holding-info {
  display: flex;
  flex-direction: column;
  gap: 4upx;
}

.holding-symbol {
  font: $font-body-bold;
  color: $neutral-900;
}

.holding-name {
  font: $font-caption-medium;
  color: $neutral-600;
}

.holding-value {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4upx;
}

.holding-amount {
  font: $font-body-bold;
  color: $neutral-900;
}

.holding-change {
  font: $font-caption-medium;
  
  &.positive {
    color: $success-500;
  }
  
  &.negative {
    color: $error-500;
  }
}
</style>
```

## 📈 交易页面示例

### 现货交易界面
```vue
<template>
  <view class="trading-interface">
    <!-- 交易对选择 -->
    <GlassCard variant="primary" size="sm" class="pair-selector">
      <view class="trading-pair">
        <text class="pair-name">BTC/USDT</text>
        <text class="pair-price">$43,125.67</text>
        <text class="pair-change positive">+2.34%</text>
      </view>
    </GlassCard>
    
    <!-- 交易按钮区 -->
    <view class="trading-buttons">
      <GlassButton 
        variant="success" 
        size="lg" 
        :class="{ active: tradeType === 'buy' }"
        @click="setTradeType('buy')"
      >
        <Icon name="arrow-tr" size="sm" color="inverse" />
        买入
      </GlassButton>
      
      <GlassButton 
        variant="error" 
        size="lg"
        :class="{ active: tradeType === 'sell' }"
        @click="setTradeType('sell')"
      >
        <Icon name="arrow-br" size="sm" color="inverse" />
        卖出
      </GlassButton>
    </view>
    
    <!-- 交易表单 -->
    <GlassCard variant="default" size="md" class="trade-form-card">
      <view class="form-group">
        <text class="form-label">价格 (USDT)</text>
        <input 
          v-model="tradePrice" 
          class="form-input"
          type="number"
          placeholder="市价"
        />
      </view>
      
      <view class="form-group">
        <text class="form-label">数量 (BTC)</text>
        <input 
          v-model="tradeAmount" 
          class="form-input"
          type="number"
          placeholder="请输入数量"
        />
      </view>
      
      <view class="form-group">
        <text class="form-label">总额 (USDT)</text>
        <text class="form-value">{{ totalValue.toFixed(2) }}</text>
      </view>
      
      <GlassButton 
        :variant="tradeType === 'buy' ? 'success' : 'error'"
        size="lg"
        :loading="isSubmitting"
        @click="submitTrade"
        class="submit-button"
      >
        {{ tradeType === 'buy' ? '买入' : '卖出' }} BTC
      </GlassButton>
    </GlassCard>
    
    <!-- 订单列表 -->
    <GlassCard 
      variant="default" 
      size="md" 
      title="当前委托"
      class="orders-card"
    >
      <view v-if="orders.length === 0" class="empty-orders">
        <Icon name="list" size="xl" color="neutral" />
        <text class="empty-text">暂无委托订单</text>
      </view>
      
      <view v-else class="orders-list">
        <view 
          v-for="order in orders" 
          :key="order.id"
          class="order-item"
        >
          <view class="order-info">
            <text :class="['order-type', order.type]">
              {{ order.type === 'buy' ? '买入' : '卖出' }}
            </text>
            <text class="order-pair">{{ order.pair }}</text>
          </view>
          <view class="order-details">
            <text class="order-price">${{ order.price }}</text>
            <text class="order-amount">{{ order.amount }} BTC</text>
          </view>
          <GlassButton 
            variant="ghost" 
            size="sm"
            @click="cancelOrder(order.id)"
          >
            撤销
          </GlassButton>
        </view>
      </view>
    </GlassCard>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { GlassCard, GlassButton, Icon } from '@/components/ui'

// 交易状态
const tradeType = ref<'buy' | 'sell'>('buy')
const tradePrice = ref('')
const tradeAmount = ref('')
const isSubmitting = ref(false)

// 订单数据
const orders = ref([
  {
    id: '1',
    type: 'buy',
    pair: 'BTC/USDT',
    price: 43000,
    amount: 0.1
  }
])

// 计算总额
const totalValue = computed(() => {
  const price = parseFloat(tradePrice.value) || 0
  const amount = parseFloat(tradeAmount.value) || 0
  return price * amount
})

// 方法
const setTradeType = (type: 'buy' | 'sell') => {
  tradeType.value = type
}

const submitTrade = async () => {
  isSubmitting.value = true
  
  try {
    // 模拟提交交易
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    uni.showToast({
      title: `${tradeType.value === 'buy' ? '买入' : '卖出'}订单已提交`,
      icon: 'success'
    })
    
    // 清空表单
    tradePrice.value = ''
    tradeAmount.value = ''
    
  } catch (error) {
    uni.showToast({
      title: '提交失败',
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const cancelOrder = (orderId: string) => {
  orders.value = orders.value.filter(order => order.id !== orderId)
  uni.showToast({
    title: '订单已撤销',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.trading-interface {
  padding: 24upx;
  background: $neutral-50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24upx;
}

.pair-selector {
  border: 2upx solid rgba($primary-500, 0.3);
}

.trading-pair {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pair-name {
  font: $font-body-bold;
  color: $neutral-900;
}

.pair-price {
  font: $font-body-medium;
  color: $neutral-700;
}

.pair-change {
  font: $font-caption-medium;
  
  &.positive {
    color: $success-500;
  }
  
  &.negative {
    color: $error-500;
  }
}

.trading-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16upx;
  
  .glass-button.active {
    transform: scale(1.02);
    box-shadow: $shadow-lg;
  }
}

.trade-form-card {
  .form-group {
    margin-bottom: 24upx;
  }
  
  .form-label {
    display: block;
    font: $font-caption-medium;
    color: $neutral-600;
    margin-bottom: 8upx;
  }
  
  .form-input {
    width: 100%;
    padding: 16upx;
    border: 1upx solid $neutral-300;
    border-radius: 12upx;
    font: $font-body-medium;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10upx);
    
    &:focus {
      border-color: $primary-500;
      outline: none;
      box-shadow: 0 0 0 3upx rgba($primary-500, 0.1);
    }
  }
  
  .form-value {
    display: block;
    font: $font-body-bold;
    color: $neutral-900;
    padding: 16upx;
    background: rgba($primary-50, 0.5);
    border-radius: 12upx;
  }
  
  .submit-button {
    width: 100%;
    margin-top: 16upx;
  }
}

.orders-card {
  .empty-orders {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16upx;
    padding: 48upx 24upx;
  }
  
  .empty-text {
    font: $font-caption-medium;
    color: $neutral-500;
  }
  
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 16upx;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16upx 0;
    border-bottom: 1upx solid $neutral-200;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .order-info {
    display: flex;
    flex-direction: column;
    gap: 4upx;
  }
  
  .order-type {
    font: $font-caption-medium;
    padding: 4upx 8upx;
    border-radius: 6upx;
    
    &.buy {
      background: rgba($success-500, 0.1);
      color: $success-500;
    }
    
    &.sell {
      background: rgba($error-500, 0.1);
      color: $error-500;
    }
  }
  
  .order-pair {
    font: $font-caption-medium;
    color: $neutral-600;
  }
  
  .order-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4upx;
  }
  
  .order-price, .order-amount {
    font: $font-caption-medium;
    color: $neutral-700;
  }
}
</style>
```

## 💰 资产管理示例

### 资产概览页面
```vue
<template>
  <view class="assets-overview">
    <!-- 总资产卡片 -->
    <PortfolioCard
      title="总资产估值"
      :amount="totalBalance"
      :change="balanceChange"
      period="24h"
      :gradient-colors="['#6f4bfd', '#8e24aa']"
      class="total-assets-card"
    />
    
    <!-- 快捷操作 -->
    <view class="asset-actions">
      <GlassCard size="sm" hoverable @click="navigateToDeposit">
        <view class="action-content">
          <Icon name="add-to-cart" size="lg" color="success" />
          <text class="action-title">充值</text>
          <text class="action-desc">向账户充值</text>
        </view>
      </GlassCard>
      
      <GlassCard size="sm" hoverable @click="navigateToWithdraw">
        <view class="action-content">
          <Icon name="remove-from-cart" size="lg" color="error" />
          <text class="action-title">提现</text>
          <text class="action-desc">提取到钱包</text>
        </view>
      </GlassCard>
      
      <GlassCard size="sm" hoverable @click="navigateToTransfer">
        <view class="action-content">
          <Icon name="arrow-separate-vertical" size="lg" color="primary" />
          <text class="action-title">划转</text>
          <text class="action-desc">内部划转</text>
        </view>
      </GlassCard>
    </view>
    
    <!-- 资产列表 -->
    <GlassCard 
      variant="default" 
      size="md" 
      title="我的资产"
      subtitle="显示有余额的币种"
      class="assets-list-card"
    >
      <view class="assets-list">
        <view 
          v-for="asset in assets.filter(a => a.balance > 0)" 
          :key="asset.symbol"
          class="asset-item"
          @tap="viewAssetDetail(asset)"
        >
          <view class="asset-info">
            <view class="asset-icon">
              <text class="asset-symbol">{{ asset.symbol }}</text>
            </view>
            <view class="asset-details">
              <text class="asset-name">{{ asset.name }}</text>
              <text class="asset-balance">{{ asset.balance.toFixed(8) }}</text>
            </view>
          </view>
          
          <view class="asset-value">
            <text class="asset-usd">${{ (asset.balance * asset.price).toFixed(2) }}</text>
            <text 
              class="asset-change"
              :class="{
                'positive': asset.change24h > 0,
                'negative': asset.change24h < 0
              }"
            >
              {{ asset.change24h > 0 ? '+' : '' }}{{ asset.change24h.toFixed(2) }}%
            </text>
          </view>
          
          <Icon name="nav-arrow-right" size="sm" color="neutral" />
        </view>
      </view>
      
      <template #footer>
        <GlassButton variant="ghost" size="sm" @click="viewAllAssets">
          查看全部币种
        </GlassButton>
      </template>
    </GlassCard>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PortfolioCard, GlassCard, GlassButton, Icon } from '@/components/ui'

// 资产数据
const assets = ref([
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 1.25643789,
    price: 43125.67,
    change24h: 3.45
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 8.97456123,
    price: 2867.23,
    change24h: -1.23
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    balance: 5430.67,
    price: 1.00,
    change24h: 0.01
  }
])

// 计算总资产
const totalBalance = computed(() => {
  return assets.value.reduce((total, asset) => {
    return total + (asset.balance * asset.price)
  }, 0)
})

const balanceChange = computed(() => {
  // 简化计算，实际应该基于历史数据
  return 2.34
})

// 导航方法
const navigateToDeposit = () => {
  uni.navigateTo({ url: '/pages/assets/deposit' })
}

const navigateToWithdraw = () => {
  uni.navigateTo({ url: '/pages/assets/withdraw' })
}

const navigateToTransfer = () => {
  uni.navigateTo({ url: '/pages/assets/transfer' })
}

const viewAssetDetail = (asset: any) => {
  uni.navigateTo({ 
    url: `/pages/assets/detail?symbol=${asset.symbol}` 
  })
}

const viewAllAssets = () => {
  console.log('查看全部币种')
}
</script>

<style lang="scss" scoped>
.assets-overview {
  padding: 24upx;
  background: $neutral-50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24upx;
}

.total-assets-card {
  box-shadow: 0 20upx 60upx rgba(142, 36, 170, 0.3);
}

.asset-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16upx;
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8upx;
  padding: 24upx 16upx;
  text-align: center;
}

.action-title {
  font: $font-body-medium;
  color: $neutral-900;
}

.action-desc {
  font: $font-caption-medium;
  color: $neutral-600;
}

.assets-list-card {
  flex: 1;
}

.assets-list {
  display: flex;
  flex-direction: column;
}

.asset-item {
  display: flex;
  align-items: center;
  padding: 20upx 0;
  border-bottom: 1upx solid $neutral-200;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: rgba($primary-50, 0.5);
  }
}

.asset-info {
  display: flex;
  align-items: center;
  gap: 16upx;
  flex: 1;
}

.asset-icon {
  width: 64upx;
  height: 64upx;
  border-radius: 50%;
  background: $gradient-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-symbol {
  font: $font-weight-bold 20upx/1 $font-family-primary;
  color: #ffffff;
}

.asset-details {
  display: flex;
  flex-direction: column;
  gap: 4upx;
}

.asset-name {
  font: $font-body-medium;
  color: $neutral-900;
}

.asset-balance {
  font: $font-caption-medium;
  color: $neutral-600;
  font-variant-numeric: tabular-nums;
}

.asset-value {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4upx;
  margin-right: 16upx;
}

.asset-usd {
  font: $font-body-bold;
  color: $neutral-900;
  font-variant-numeric: tabular-nums;
}

.asset-change {
  font: $font-caption-medium;
  
  &.positive {
    color: $success-500;
  }
  
  &.negative {
    color: $error-500;
  }
}
</style>
```

## 📋 使用指南总结

### 1. 组件导入
```typescript
// 按需导入
import { PortfolioCard, GlassCard, GlassButton, Icon } from '@/components/ui'

// 全局注册 (在main.ts中)
import * as UIComponents from '@/components/ui'
Object.entries(UIComponents).forEach(([name, component]) => {
  app.component(name, component)
})
```

### 2. 样式系统使用
```scss
// 使用设计token
.custom-component {
  background: $gradient-primary;
  font: $font-body-medium;
  color: $neutral-900;
  padding: $spacing-md;
  border-radius: $border-radius-lg;
}
```

### 3. 响应式适配
```vue
<template>
  <!-- 响应式组件 -->
  <GlassCard :size="cardSize">
    <PortfolioCard :amount="amount" />
  </GlassCard>
</template>

<script setup>
const { windowWidth } = uni.getSystemInfoSync()
const cardSize = windowWidth < 768 ? 'sm' : 'lg'
</script>
```

### 4. 主题定制
```scss
// 自定义CSS变量
:root {
  --primary-color: #your-brand-color;
  --glass-bg: rgba(255, 255, 255, 0.9);
  --shadow-custom: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

_📅 最后更新: 2025年9月27日_  
_📱 示例代码: 基于v1.1.0组件库_
