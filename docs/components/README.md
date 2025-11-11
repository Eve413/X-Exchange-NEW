# 组件库文档

X交易所组件库包含了现代UI组件和业务组件，为开发提供一致的设计语言和交互体验。

## 🧩 组件分类

```
组件库架构/
├── 🎨 现代UI组件
│   ├── PortfolioCard    # 投资组合卡片
│   ├── GlassCard        # 玻璃拟态卡片
│   ├── GlassButton      # 玻璃拟态按钮
│   └── Icon             # 图标组件
├── 🔧 通用组件
│   ├── AppLoading       # 全局加载
│   ├── AppToast         # 全局提示
│   ├── NetworkMonitor   # 网络监控
│   ├── CoinIcon         # 币种图标
│   ├── Empty            # 空状态
│   ├── Loading          # 加载组件
│   ├── PercentChange    # 涨跌幅显示
│   └── PriceDisplay     # 价格显示
└── 💼 业务组件
    └── TradingPair      # 交易对组件
```

## 🎨 现代UI组件

### 特色功能
- **玻璃拟态效果** - 基于uiverse.io设计理念
- **渐变背景** - 现代化的视觉效果
- **交互动画** - 流畅的用户体验
- **多变体支持** - 灵活的样式选择

### 核心组件

#### PortfolioCard - 投资组合卡片
```vue
<PortfolioCard
  title="My Portfolio"
  :amount="20563.02"
  :change="8.98"
  period="7 days"
  :gradient-colors="['#6f4bfd', '#ff6b9d']"
/>
```

**使用场景:**
- 投资组合总览
- 资产价值展示
- 收益统计卡片

#### GlassCard - 玻璃拟态卡片
```vue
<GlassCard variant="primary" size="md" hoverable>
  <template #header>
    <h3>卡片标题</h3>
  </template>
  <p>卡片内容</p>
  <template #footer>
    <GlassButton>操作按钮</GlassButton>
  </template>
</GlassCard>
```

**变体类型:**
- `default` - 默认透明样式
- `primary` - 品牌色调
- `success` - 成功状态
- `error` - 错误状态
- `dark` - 深色主题

#### GlassButton - 玻璃拟态按钮
```vue
<GlassButton variant="primary" size="lg" @click="handleClick">
  <Icon name="star" size="sm" /> 立即开始
</GlassButton>
```

**按钮类型:**
- `primary` - 主要操作
- `secondary` - 次要操作
- `success` - 成功/买入操作
- `error` - 错误/卖出操作
- `ghost` - 幽灵按钮

#### Icon - 图标组件
```vue
<Icon name="home" size="md" color="primary" clickable />
```

**特色功能:**
- 1671+免费图标 (iconoir.com)
- 自动降级显示
- 交易所专用预设
- 多尺寸支持

## 🔧 通用组件

### 全局组件
这些组件通常在应用级别使用，提供全局功能。

#### AppLoading - 全局加载
```vue
<AppLoading :show="isLoading" text="加载中..." />
```

#### AppToast - 全局提示
```vue
<AppToast 
  :show="showToast" 
  type="success" 
  message="操作成功!" 
/>
```

#### NetworkMonitor - 网络监控
```vue
<NetworkMonitor @network-change="handleNetworkChange" />
```

### 展示组件

#### CoinIcon - 币种图标
```vue
<CoinIcon symbol="BTC" size="lg" />
```

#### Empty - 空状态
```vue
<Empty 
  icon="inbox"
  title="暂无数据"
  description="当前没有可显示的内容"
  :show-action="true"
  action-text="刷新"
  @action="handleRefresh"
/>
```

#### Loading - 加载组件
```vue
<Loading type="spinner" size="md" text="加载中..." />
```

#### PercentChange - 涨跌幅显示
```vue
<PercentChange 
  :value="3.45" 
  :show-icon="true"
  size="md"
/>
```

#### PriceDisplay - 价格显示
```vue
<PriceDisplay 
  :value="43125.67"
  currency="USD"
  :precision="2"
  size="lg"
/>
```

## 💼 业务组件

### 交易专用组件

#### TradingPair - 交易对组件
```vue
<TradingPair
  base="BTC"
  quote="USDT"
  :price="43125.67"
  :change="3.45"
  :volume="156789.12"
  clickable
  @click="handlePairClick"
/>
```

**功能特点:**
- 实时价格显示
- 涨跌幅颜色自适应
- 24H交易量
- 点击交互

## 📖 组件使用指南

### 1. 导入方式

#### 按需导入
```typescript
import { 
  PortfolioCard, 
  GlassButton, 
  Icon 
} from '@/components/ui'

import { 
  AppLoading, 
  CoinIcon,
  PriceDisplay 
} from '@/components/common'
```

#### 全局注册
```typescript
// main.ts
import * as UIComponents from '@/components/ui'
import * as CommonComponents from '@/components/common'

// 注册UI组件
Object.entries(UIComponents).forEach(([name, component]) => {
  app.component(name, component)
})

// 注册通用组件
Object.entries(CommonComponents).forEach(([name, component]) => {
  app.component(name, component)
})
```

### 2. 组件组合使用

#### 交易界面示例
```vue
<template>
  <view class="trading-page">
    <!-- 交易对信息 -->
    <GlassCard variant="primary">
      <TradingPair
        base="BTC"
        quote="USDT"
        :price="currentPrice"
        :change="priceChange"
      />
    </GlassCard>
    
    <!-- 交易按钮 -->
    <view class="trading-actions">
      <GlassButton 
        variant="success" 
        size="lg"
        @click="handleBuy"
      >
        <Icon name="arrow-up" size="sm" color="inverse" />
        买入
      </GlassButton>
      
      <GlassButton 
        variant="error" 
        size="lg"
        @click="handleSell"
      >
        <Icon name="arrow-down" size="sm" color="inverse" />
        卖出
      </GlassButton>
    </view>
    
    <!-- 价格显示 -->
    <GlassCard>
      <view class="price-info">
        <text class="price-label">当前价格</text>
        <PriceDisplay 
          :value="currentPrice"
          currency="USD"
          size="xl"
        />
        <PercentChange 
          :value="priceChange"
          :show-icon="true"
        />
      </view>
    </GlassCard>
    
    <!-- 加载状态 -->
    <AppLoading :show="isLoading" />
    
    <!-- 全局提示 -->
    <AppToast 
      :show="showToast"
      :type="toastType"
      :message="toastMessage"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  GlassCard, 
  GlassButton, 
  Icon,
  PortfolioCard 
} from '@/components/ui'
import { 
  AppLoading, 
  AppToast,
  TradingPair, 
  PriceDisplay, 
  PercentChange 
} from '@/components/common'

const currentPrice = ref(43125.67)
const priceChange = ref(3.45)
const isLoading = ref(false)
const showToast = ref(false)
const toastType = ref<'success' | 'error' | 'warning'>('success')
const toastMessage = ref('')

const handleBuy = () => {
  showToast.value = true
  toastType.value = 'success'
  toastMessage.value = '买入订单已提交'
}

const handleSell = () => {
  showToast.value = true
  toastType.value = 'error'
  toastMessage.value = '卖出订单已提交'
}
</script>

<style lang="scss" scoped>
.trading-page {
  padding: 24upx;
  background: $neutral-50;
  display: flex;
  flex-direction: column;
  gap: 24upx;
}

.trading-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16upx;
}

.price-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12upx;
}

.price-label {
  font: $font-caption-medium;
  color: $neutral-600;
}
</style>
```

### 3. 响应式适配

#### 组件响应式使用
```vue
<template>
  <view class="responsive-layout">
    <GlassCard :size="cardSize">
      <PortfolioCard 
        :amount="amount"
        :change="change"
      />
    </GlassCard>
    
    <GlassButton :size="buttonSize">
      操作按钮
    </GlassButton>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { windowWidth } = uni.getSystemInfoSync()

// 响应式尺寸
const cardSize = computed(() => {
  if (windowWidth < 768) return 'sm'
  if (windowWidth < 1200) return 'md'
  return 'lg'
})

const buttonSize = computed(() => {
  return windowWidth < 768 ? 'md' : 'lg'
})
</script>

<style lang="scss" scoped>
.responsive-layout {
  padding: 24upx;
  
  @media (max-width: 768upx) {
    padding: 16upx;
  }
  
  @media (min-width: 1200upx) {
    padding: 32upx;
  }
}
</style>
```

## ⚡ 性能优化

### 1. 按需加载
```vue
<script setup lang="ts">
// 动态导入，减少初始包大小
const HeavyComponent = defineAsyncComponent(() => 
  import('@/components/business/HeavyComponent.vue')
)
</script>
```

### 2. 组件缓存
```vue
<template>
  <!-- 使用keep-alive缓存组件状态 -->
  <keep-alive>
    <TradingPair v-if="showTrading" />
  </keep-alive>
</template>
```

### 3. 虚拟滚动
```vue
<template>
  <!-- 大量数据使用虚拟滚动 -->
  <scroll-view 
    v-for="item in visibleItems" 
    :key="item.id"
    class="list-item"
  >
    <TradingPair :data="item" />
  </scroll-view>
</template>
```

## ✅ 最佳实践

### 1. 组件命名
- 使用PascalCase命名
- 组件文件以.vue结尾
- 业务组件加上业务前缀

### 2. Props定义
```typescript
// 使用TypeScript接口定义Props
interface ComponentProps {
  title: string                    // 必需属性
  subtitle?: string               // 可选属性
  size?: 'sm' | 'md' | 'lg'      // 限定值
  onClick?: () => void            // 函数类型
}

const props = withDefaults(defineProps<ComponentProps>(), {
  size: 'md'
})
```

### 3. 样式规范
```scss
// 使用BEM命名规范
.component-name {
  // 组件根样式
  
  &__element {
    // 元素样式
  }
  
  &--modifier {
    // 修饰符样式
  }
}
```

### 4. 事件处理
```typescript
// 定义明确的事件接口
interface ComponentEmits {
  click: [event: Event]
  change: [value: string]
  submit: [data: FormData]
}

const emit = defineEmits<ComponentEmits>()
```

## 🔗 相关文档

- [设计系统](../design-system/README.md) - 了解设计规范
- [使用示例](../design-system/usage-examples.md) - 查看实际应用
- [开发指南](../development/getting-started.md) - 快速开始
- [API文档](../api/README.md) - 接口调用指南

---

_📅 最后更新: 2025年9月27日_  
_🧩 组件库: 13个组件，覆盖UI、通用、业务场景_
