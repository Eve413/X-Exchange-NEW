# 图标系统

X交易所集成了[iconoir.com](https://iconoir.com/)开源图标库，提供1671+个高质量的SVG图标，专门为现代应用程序设计。

## 🎯 图标库特色

### 为什么选择Iconoir？
- **🆓 完全免费** - 1671+个图标，MIT开源协议
- **🎨 统一风格** - 一致的设计语言和视觉风格
- **📦 轻量级** - SVG格式，无限缩放，文件小
- **🔧 易于使用** - 简单的API和组件化封装
- **🚀 持续更新** - 活跃的开源社区，定期增加新图标

### 图标设计特点
- **1.5px描边** - 统一的线条粗细
- **24x24px基准** - 标准的设计规格
- **圆角处理** - 现代化的视觉效果
- **清晰识别** - 优秀的可读性和辨识度

## 🧩 图标组件

### 基础用法
```vue
<template>
  <!-- 基础图标 -->
  <Icon name="home" />
  
  <!-- 自定义尺寸 -->
  <Icon name="user" size="lg" />
  
  <!-- 自定义颜色 -->
  <Icon name="heart" color="error" />
  
  <!-- 可点击图标 -->
  <Icon name="settings" clickable @click="handleClick" />
  
  <!-- 自定义尺寸（数字） -->
  <Icon name="star" :custom-size="64" />
</template>

<script setup>
import { Icon } from '@/components/ui'

const handleClick = () => {
  console.log('图标被点击')
}
</script>
```

### 组件Props
```typescript
interface IconProps {
  name: string                    // 图标名称
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' // 预设尺寸
  color?: 'primary' | 'success' | 'error' | 'warning' | 'neutral' | 'inverse' | string // 颜色
  clickable?: boolean            // 是否可点击
  customSize?: number            // 自定义尺寸(upx)
}
```

## 📖 图标分类

### 导航类图标
```typescript
const NAVIGATION_ICONS = {
  home: 'home-simple',          // 首页
  back: 'nav-arrow-left',       // 返回
  forward: 'nav-arrow-right',   // 前进
  up: 'nav-arrow-up',           // 向上
  down: 'nav-arrow-down',       // 向下
  menu: 'menu',                 // 菜单
  close: 'cancel',              // 关闭
}
```

### 交易专用图标
```typescript
const TRADING_ICONS = {
  trade: 'stats-up-square',     // 交易
  buy: 'arrow-tr',              // 买入
  sell: 'arrow-br',             // 卖出
  chart: 'graph-up',            // 图表
  trending: 'trending-up',      // 趋势
  portfolio: 'wallet',          // 投资组合
  balance: 'piggy-bank',        // 余额
}
```

### 用户相关图标
```typescript
const USER_ICONS = {
  user: 'profile-circle',       // 用户
  users: 'group',               // 用户组
  login: 'log-in',              // 登录
  logout: 'log-out',            // 登出
  register: 'add-user',         // 注册
}
```

### 功能类图标
```typescript
const FUNCTION_ICONS = {
  search: 'search',             // 搜索
  filter: 'filter',             // 筛选
  sort: 'sort',                 // 排序
  refresh: 'refresh-double',    // 刷新
  download: 'download',         // 下载
  upload: 'upload',             // 上传
  share: 'share-ios',           // 分享
  copy: 'copy',                 // 复制
}
```

## 🎨 尺寸系统

### 预设尺寸
```scss
$icon-sizes: (
  xs: 32upx,    // 16px
  sm: 40upx,    // 20px  
  md: 48upx,    // 24px - 默认
  lg: 56upx,    // 28px
  xl: 64upx,    // 32px
  2xl: 80upx,   // 40px
);
```

### 使用场景
- **xs (32upx)** - 行内图标，表格中的小图标
- **sm (40upx)** - 按钮图标，导航图标
- **md (48upx)** - 卡片图标，列表图标 (默认)
- **lg (56upx)** - 页面标题图标，重要功能图标
- **xl (64upx)** - 大按钮图标，特色功能图标
- **2xl (80upx)** - 空状态图标，装饰性图标

## 🌈 颜色系统

### 预设颜色
```scss
.color-primary { color: $primary-500; }      // 品牌色
.color-success { color: $success-500; }      // 成功/买入
.color-error { color: $error-500; }          // 错误/卖出
.color-warning { color: $warning-500; }      // 警告
.color-neutral { color: $neutral-600; }      // 中性
.color-inverse { color: #ffffff; }           // 反色
```

### 自定义颜色
```vue
<template>
  <!-- 使用十六进制颜色 -->
  <Icon name="star" color="#ff6b9d" />
  
  <!-- 使用CSS变量 -->
  <Icon name="heart" color="var(--custom-color)" />
</template>
```

## 🏪 交易所专用预设

### 主导航图标
```typescript
const MAIN_NAV_ICONS = {
  dashboard: 'home-simple',     // 仪表盘
  market: 'graph-up',           // 行情
  spot: 'stats-up-square',      // 现货交易
  futures: 'graph-down',        // 合约交易
  assets: 'wallet',             // 资产
  profile: 'profile-circle',    // 个人中心
}
```

### 交易操作图标
```typescript
const TRADE_ACTION_ICONS = {
  buyOrder: 'arrow-tr',         // 买入订单
  sellOrder: 'arrow-br',        // 卖出订单
  orderBook: 'list',            // 订单簿
  priceChart: 'graph-up',       // 价格图表
  tradingPair: 'switch-horizontal', // 交易对
}
```

### 资产管理图标
```typescript
const ASSET_ICONS = {
  deposit: 'add-to-cart',       // 充值
  withdraw: 'remove-from-cart', // 提现
  transfer: 'arrow-separate-vertical', // 划转
  history: 'clock-outline',     // 历史记录
  balance: 'piggy-bank',        // 余额
}
```

## 📱 实际应用示例

### 导航栏
```vue
<template>
  <view class="tab-bar">
    <view 
      v-for="tab in tabs" 
      :key="tab.key"
      class="tab-item"
      :class="{ active: currentTab === tab.key }"
      @tap="switchTab(tab.key)"
    >
      <Icon 
        :name="tab.icon" 
        size="md" 
        :color="currentTab === tab.key ? 'primary' : 'neutral'" 
      />
      <text class="tab-text">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup>
const tabs = [
  { key: 'home', icon: 'home-simple', label: '首页' },
  { key: 'market', icon: 'graph-up', label: '行情' },
  { key: 'trade', icon: 'stats-up-square', label: '交易' },
  { key: 'assets', icon: 'wallet', label: '资产' },
  { key: 'profile', icon: 'profile-circle', label: '我的' },
]
</script>
```

### 交易按钮
```vue
<template>
  <view class="trading-buttons">
    <!-- 买入按钮 -->
    <GlassButton 
      variant="success" 
      size="lg" 
      @click="handleBuy"
    >
      <Icon name="arrow-tr" size="sm" color="inverse" />
      买入
    </GlassButton>
    
    <!-- 卖出按钮 -->
    <GlassButton 
      variant="error" 
      size="lg" 
      @click="handleSell"
    >
      <Icon name="arrow-br" size="sm" color="inverse" />
      卖出
    </GlassButton>
  </view>
</template>
```

### 功能列表
```vue
<template>
  <view class="function-list">
    <view 
      v-for="item in functions" 
      :key="item.key"
      class="function-item"
      @tap="handleFunction(item.key)"
    >
      <Icon 
        :name="item.icon" 
        size="lg" 
        color="primary" 
        clickable 
      />
      <view class="function-info">
        <text class="function-title">{{ item.title }}</text>
        <text class="function-desc">{{ item.desc }}</text>
      </view>
      <Icon name="nav-arrow-right" size="sm" color="neutral" />
    </view>
  </view>
</template>

<script setup>
const functions = [
  {
    key: 'deposit',
    icon: 'add-to-cart',
    title: '充值',
    desc: '向账户充值数字资产'
  },
  {
    key: 'withdraw',
    icon: 'remove-from-cart',
    title: '提现',
    desc: '提取数字资产到外部地址'
  },
  {
    key: 'transfer',
    icon: 'arrow-separate-vertical',
    title: '划转',
    desc: '在不同账户间转移资金'
  }
]
</script>
```

## 🔧 工具函数

### 检查图标是否存在
```typescript
import { hasIcon } from '@/utils'

// 检查图标是否存在
if (hasIcon('home-simple')) {
  console.log('图标存在')
}
```

### 获取图标URL
```typescript
import { getIconUrl } from '@/utils'

// 获取图标的CDN地址
const iconUrl = getIconUrl('home-simple', 'jsdelivr')
console.log(iconUrl) // https://cdn.jsdelivr.net/gh/lucaburgio/iconoir@main/icons/home-simple.svg
```

### 获取后备图标
```typescript
import { getIconFallback } from '@/utils'

// 获取Unicode后备字符
const fallback = getIconFallback('home-simple')
console.log(fallback) // 🏠
```

## 📋 图标使用规范

### 语义化使用
- **✅ 正确** - 用搜索图标表示搜索功能
- **❌ 错误** - 用搜索图标表示过滤功能

### 尺寸一致性
- **同级元素** - 使用相同尺寸的图标
- **视觉平衡** - 考虑图标与文字的比例关系

### 颜色规范
- **功能色** - 买入用绿色，卖出用红色
- **状态色** - 成功、警告、错误使用对应颜色
- **中性色** - 装饰性图标使用中性色

## ✅ 图标检查清单

使用图标时，请确认：

- [ ] 选择了语义化合适的图标
- [ ] 使用了统一的尺寸规格
- [ ] 颜色符合功能语义
- [ ] 在不同设备上测试了显示效果
- [ ] 考虑了图标的加载失败情况
- [ ] 可点击图标添加了交互反馈
- [ ] 图标与文字的对齐和间距合适

## 🔗 资源链接

- [Iconoir官网](https://iconoir.com/) - 浏览所有可用图标
- [GitHub仓库](https://github.com/lucaburgio/iconoir) - 查看源码和贡献
- [在线图标搜索](https://iconoir.com/search) - 快速找到需要的图标

---

_📅 最后更新: 2025年9月27日_  
_🎯 图标系统: Iconoir v7.11.0 (1671+图标)_
