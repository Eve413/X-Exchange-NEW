# UI组件库

X交易所的现代UI组件库基于uiverse.io的设计理念，提供玻璃拟态效果和现代化的交互体验。

## 🎨 设计理念

### 玻璃拟态 (Glassmorphism)
- **透明质感** - 模糊背景，营造现代感
- **层次清晰** - 通过透明度和阴影表现层级
- **轻盈美观** - 减少视觉重量，提升用户体验

### 现代交互
- **流畅动画** - 自然的过渡效果
- **悬停反馈** - 明确的交互状态
- **响应式设计** - 适配多种设备尺寸

## 🧩 组件概览

```
UI组件库/
├── 🎴 卡片组件
│   ├── PortfolioCard    # 投资组合卡片
│   └── GlassCard        # 玻璃拟态卡片
├── 🔘 按钮组件
│   └── GlassButton      # 玻璃拟态按钮
├── 🎯 图标组件
│   └── Icon             # 图标组件
└── 📐 布局组件
    └── (规划中)
```

## 🎴 卡片组件

### PortfolioCard 投资组合卡片

专为投资组合展示设计的现代化卡片，具有渐变背景和数据展示功能。

```vue
<template>
  <PortfolioCard
    title="My Portfolio"
    :amount="20563.02"
    :change="8.98"
    period="7 days"
    :gradient-colors="['#6f4bfd', '#ff6b9d']"
  />
</template>
```

**Props 参数**
```typescript
interface PortfolioCardProps {
  title?: string                    // 卡片标题
  amount: number                    // 金额数值
  change: number                    // 变化百分比
  period?: string                   // 时间周期
  gradientColors?: [string, string] // 渐变色彩
}
```

**特色功能**
- ✨ 渐变背景效果
- 📈 自动涨跌颜色
- 📊 简化图表线条
- 💰 货币格式化
- 🌟 玻璃拟态效果

### GlassCard 玻璃拟态卡片

通用的玻璃拟态卡片组件，支持多种变体和交互状态。

```vue
<template>
  <GlassCard 
    variant="primary" 
    size="md" 
    title="交易统计"
    subtitle="今日数据"
    hoverable
    elevated
    @click="handleClick"
  >
    <!-- 卡片内容 -->
    <view class="card-content">
      <text class="data-value">$12,456.78</text>
      <text class="data-label">今日交易额</text>
    </view>
    
    <!-- 底部操作 -->
    <template #footer>
      <GlassButton size="sm" variant="ghost">
        查看详情
      </GlassButton>
    </template>
  </GlassCard>
</template>
```

**Props 参数**
```typescript
interface GlassCardProps {
  variant?: 'default' | 'primary' | 'success' | 'error' | 'dark' // 卡片变体
  size?: 'sm' | 'md' | 'lg'         // 卡片尺寸
  title?: string                     // 卡片标题
  subtitle?: string                  // 卡片副标题
  hoverable?: boolean                // 是否可悬停
  elevated?: boolean                 // 是否有阴影
}
```

**变体效果**
- **default** - 浅色透明背景
- **primary** - 品牌色调背景
- **success** - 成功色调背景
- **error** - 错误色调背景
- **dark** - 深色背景

## 🔘 按钮组件

### GlassButton 玻璃拟态按钮

现代化的按钮组件，支持多种样式和交互效果。

```vue
<template>
  <!-- 基础按钮 -->
  <GlassButton variant="primary" size="md" @click="handleClick">
    点击我
  </GlassButton>
  
  <!-- 带图标的按钮 -->
  <GlassButton variant="success" size="lg" icon="🚀" @click="handleTrade">
    开始交易
  </GlassButton>
  
  <!-- 加载状态按钮 -->
  <GlassButton variant="primary" :loading="isLoading" @click="handleSubmit">
    提交订单
  </GlassButton>
  
  <!-- 禁用状态按钮 -->
  <GlassButton variant="secondary" :disabled="true">
    暂时禁用
  </GlassButton>
</template>
```

**Props 参数**
```typescript
interface GlassButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost' // 按钮变体
  size?: 'sm' | 'md' | 'lg'          // 按钮尺寸
  text?: string                      // 按钮文字
  icon?: string                      // 按钮图标
  disabled?: boolean                 // 是否禁用
  loading?: boolean                  // 加载状态
}
```

**交互效果**
- **悬停效果** - 上移2upx + 发光效果
- **点击反馈** - 轻微下压动画
- **加载动画** - 旋转的圆形指示器
- **禁用状态** - 降低透明度 + 禁用交互

## 🎯 图标组件

### Icon 图标组件

集成iconoir.com图标库的组件，支持1671+个免费图标。

```vue
<template>
  <!-- 基础图标 -->
  <Icon name="home" />
  
  <!-- 自定义尺寸和颜色 -->
  <Icon name="star" size="lg" color="warning" />
  
  <!-- 可点击图标 -->
  <Icon name="settings" clickable @click="openSettings" />
  
  <!-- 自定义尺寸 -->
  <Icon name="logo" :custom-size="128" />
</template>
```

详细使用方法请参考 [图标系统文档](./icons.md)。

## 📱 响应式设计

### 断点定义
```scss
$breakpoints: (
  xs: 0,
  sm: 576upx,
  md: 768upx,
  lg: 992upx,
  xl: 1200upx,
  xxl: 1400upx
);
```

### 响应式组件
```vue
<template>
  <!-- 响应式卡片 -->
  <GlassCard 
    :size="cardSize"
    class="responsive-card"
  >
    <PortfolioCard
      :amount="portfolioAmount"
      :change="8.98"
    />
  </GlassCard>
</template>

<script setup>
import { computed } from 'vue'

// 根据屏幕尺寸调整组件大小
const cardSize = computed(() => {
  const screenWidth = uni.getSystemInfoSync().windowWidth
  
  if (screenWidth < 768) return 'sm'
  if (screenWidth < 1200) return 'md'
  return 'lg'
})
</script>

<style lang="scss" scoped>
.responsive-card {
  // 移动端
  @media (max-width: 768upx) {
    margin: 16upx;
    border-radius: 16upx;
  }
  
  // 桌面端
  @media (min-width: 1200upx) {
    margin: 32upx;
    border-radius: 24upx;
  }
}
</style>
```

## 🎨 主题定制

### CSS变量
```css
:root {
  /* 玻璃拟态效果 */
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-backdrop: blur(20px);
  
  /* 阴影系统 */
  --shadow-sm: 0 2upx 8upx rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4upx 16upx rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8upx 32upx rgba(0, 0, 0, 0.2);
  
  /* 动画时长 */
  --transition-fast: 0.15s;
  --transition-base: 0.3s;
  --transition-slow: 0.5s;
}
```

### 暗色主题 (预留)
```css
[data-theme="dark"] {
  --glass-bg: rgba(0, 0, 0, 0.6);
  --glass-border: rgba(255, 255, 255, 0.1);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
}
```

## 🔧 组件扩展

### 自定义组件
```vue
<template>
  <GlassCard 
    variant="custom"
    class="trading-overview-card"
  >
    <!-- 自定义内容结构 -->
    <view class="trading-header">
      <Icon name="stats-up-square" size="lg" color="primary" />
      <text class="trading-title">交易概览</text>
    </view>
    
    <view class="trading-stats">
      <view class="stat-item">
        <text class="stat-value">156</text>
        <text class="stat-label">今日交易</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">$12,456</text>
        <text class="stat-label">交易额</text>
      </view>
    </view>
    
    <template #footer>
      <GlassButton variant="primary" size="sm">
        查看全部
      </GlassButton>
    </template>
  </GlassCard>
</template>

<style lang="scss" scoped>
.trading-overview-card {
  background: $gradient-portfolio;
  
  .trading-header {
    display: flex;
    align-items: center;
    gap: 12upx;
    margin-bottom: 24upx;
  }
  
  .trading-title {
    font: $font-heading-medium;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .trading-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24upx;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font: $font-weight-bold 36upx/1.2 $font-family-primary;
    color: #ffffff;
    margin-bottom: 8upx;
  }
  
  .stat-label {
    font: $font-caption-medium;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
```

## ✅ 组件使用检查清单

使用组件时，请确认：

- [ ] 选择了合适的组件变体
- [ ] 设置了恰当的组件尺寸
- [ ] 处理了组件的交互事件
- [ ] 考虑了组件的加载和错误状态
- [ ] 在不同设备上测试了显示效果
- [ ] 遵循了组件的使用规范
- [ ] 添加了必要的无障碍属性

## 🚀 性能优化

### 懒加载
```vue
<script setup>
// 动态导入组件
const GlassCard = defineAsyncComponent(() => import('@/components/ui/GlassCard.vue'))
const PortfolioCard = defineAsyncComponent(() => import('@/components/ui/PortfolioCard.vue'))
</script>
```

### 条件渲染
```vue
<template>
  <!-- 仅在需要时渲染复杂组件 -->
  <PortfolioCard 
    v-if="showPortfolio"
    :amount="amount"
    :change="change"
  />
</template>
```

---

_📅 最后更新: 2025年9月27日_  
_🧩 组件库版本: v1.1.0 - 基于uiverse.io设计理念_
