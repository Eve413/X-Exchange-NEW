# 快速开始

本指南将帮助您快速搭建X交易所项目的开发环境，并开始使用现代设计系统进行开发。

## 🛠️ 环境要求

### 必需软件
- **HBuilderX** >= 3.6.0 (推荐开发工具)
- **Node.js** >= 16.0.0 (可选，用于包管理)
- **Git** - 版本控制

### 推荐软件
- **Visual Studio Code** (如需要更好的TypeScript支持)
- **Chrome/Firefox** (H5端调试)
- **微信开发者工具** (小程序调试)

## 📥 项目获取

### 克隆项目
```bash
git clone [项目地址]
cd X交易所2
```

### 目录结构概览
```
X交易所2/
├── pages/           # 页面文件
├── components/      # 组件库
├── utils/          # 工具函数
├── styles/         # 样式系统
├── static/         # 静态资源
├── docs/           # 项目文档
└── 配置文件...
```

## 🚀 快速启动

### 方式一：HBuilderX (推荐)
1. **打开项目**
   - 启动HBuilderX
   - 文件 → 打开目录 → 选择项目根目录

2. **运行项目**
   - 运行 → 运行到浏览器 → 选择Chrome/Firefox
   - 项目会自动编译并在浏览器中打开

3. **多端运行**
   ```
   运行到浏览器    → H5端预览
   运行到小程序    → 微信小程序预览
   运行到手机App  → App端预览
   ```

### 方式二：命令行 (可选)
```bash
# 安装依赖 (如果需要)
npm install

# 启动H5开发服务
npm run dev:h5

# 启动微信小程序开发
npm run dev:mp-weixin

# 启动App开发
npm run dev:app
```

## 🎨 设计系统使用

### 1. 导入组件
```vue
<script setup lang="ts">
import { PortfolioCard, GlassButton, Icon } from '@/components/ui'
</script>
```

### 2. 使用现代组件
```vue
<template>
  <!-- 投资组合卡片 -->
  <PortfolioCard
    title="我的投资组合"
    :amount="20563.02"
    :change="8.98"
  />
  
  <!-- 玻璃拟态按钮 -->
  <GlassButton variant="primary" @click="handleAction">
    <Icon name="star" size="sm" /> 立即开始
  </GlassButton>
</template>
```

### 3. 使用SCSS变量
```scss
<style lang="scss" scoped>
.my-component {
  background: $gradient-primary;
  color: $neutral-900;
  font: $font-body-medium;
  padding: $spacing-lg;
}
</style>
```

## 📱 页面开发

### 创建新页面
1. **在pages.json中注册**
```json
{
  "pages": [
    {
      "path": "pages/my-page/index",
      "style": {
        "navigationBarTitleText": "我的页面"
      }
    }
  ]
}
```

2. **创建页面文件**
```vue
<!-- pages/my-page/index.vue -->
<template>
  <view class="page-container">
    <GlassCard title="页面标题">
      <text>页面内容</text>
    </GlassCard>
  </view>
</template>

<script setup lang="ts">
import { GlassCard } from '@/components/ui'

// 页面逻辑
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24upx;
  background: $neutral-50;
  min-height: 100vh;
}
</style>
```

## 🧩 组件开发

### 创建自定义组件
```vue
<!-- components/business/MyComponent.vue -->
<template>
  <GlassCard :variant="variant" :size="size">
    <view class="component-content">
      <Icon :name="icon" size="lg" :color="iconColor" />
      <text class="component-title">{{ title }}</text>
      <text class="component-desc">{{ description }}</text>
    </view>
    
    <template #footer>
      <GlassButton variant="primary" @click="handleAction">
        {{ buttonText }}
      </GlassButton>
    </template>
  </GlassCard>
</template>

<script setup lang="ts">
import { GlassCard, GlassButton, Icon } from '@/components/ui'

interface Props {
  title: string
  description?: string
  icon?: string
  variant?: 'default' | 'primary' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  buttonText: '确定'
})

const iconColor = computed(() => {
  switch (props.variant) {
    case 'primary': return 'primary'
    case 'success': return 'success'
    case 'error': return 'error'
    default: return 'neutral'
  }
})

const emit = defineEmits<{
  action: []
}>()

const handleAction = () => {
  emit('action')
}
</script>

<style lang="scss" scoped>
.component-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16upx;
  text-align: center;
}

.component-title {
  font: $font-heading-medium;
  color: $neutral-900;
}

.component-desc {
  font: $font-body-medium;
  color: $neutral-600;
}
</style>
```

## 🌍 国际化使用

### 1. 语言文件
```json
// locales/zh-CN.json
{
  "welcome": "欢迎使用X交易所",
  "trading": {
    "buy": "买入",
    "sell": "卖出"
  }
}
```

### 2. 在组件中使用
```vue
<template>
  <view>
    <text>{{ $t('welcome') }}</text>
    <GlassButton>{{ $t('trading.buy') }}</GlassButton>
  </view>
</template>

<script setup lang="ts">
// 也可以使用组合式API
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
```

## 🔧 工具函数使用

### 导入工具
```typescript
import { 
  request,           // 网络请求
  storage,           // 本地存储
  AuthUtils,         // 认证工具
  NumberFormat,      // 数字格式化
  i18nUtils          // 国际化工具
} from '@/utils'
```

### 使用示例
```typescript
// 网络请求
const data = await request.get('/api/market/ticker')

// 本地存储
storage.set('userInfo', { name: 'John' })
const userInfo = storage.get('userInfo')

// 数字格式化
const formattedPrice = NumberFormat.currency(1234.56) // $1,234.56

// 语言切换
i18nUtils.setLocale('zh-TW')
```

## 🎯 常用功能

### 路由导航
```typescript
// 页面跳转
uni.navigateTo({ url: '/pages/trade/index' })

// 传递参数
uni.navigateTo({ 
  url: '/pages/detail/index?id=123&type=buy' 
})

// 返回上页
uni.navigateBack()
```

### 用户交互
```typescript
// 显示提示
uni.showToast({
  title: '操作成功',
  icon: 'success'
})

// 显示确认框
uni.showModal({
  title: '确认',
  content: '确定要删除吗？',
  success: (res) => {
    if (res.confirm) {
      console.log('用户点击确定')
    }
  }
})
```

### 数据请求
```typescript
// 使用封装的request
import { request } from '@/utils'

const fetchUserData = async () => {
  try {
    const response = await request.get('/api/user/info')
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    uni.showToast({
      title: '请求失败',
      icon: 'error'
    })
  }
}
```

## 📋 开发检查清单

开始开发前，请确认：

- [ ] HBuilderX已正确安装并打开项目
- [ ] 项目在浏览器中可以正常运行
- [ ] 了解了基本的组件导入和使用方法
- [ ] 熟悉了SCSS变量和样式系统
- [ ] 掌握了页面创建和路由配置
- [ ] 了解了国际化的基本用法

## 🆘 常见问题

### Q: 项目无法启动怎么办？
A: 
1. 检查HBuilderX版本是否>=3.6.0
2. 确认项目路径中没有中文或特殊字符
3. 尝试重新导入项目

### Q: 组件导入报错？
A: 
1. 检查导入路径是否正确：`@/components/ui`
2. 确认组件名称拼写正确
3. 查看组件是否已正确导出

### Q: 样式不生效？
A: 
1. 确认使用了`<style lang="scss" scoped>`
2. 检查SCSS变量导入是否正确
3. 验证CSS选择器优先级

### Q: 图标不显示？
A: 
1. 检查图标名称是否正确
2. 在H5端图标可能需要网络加载
3. 可以使用后备Unicode字符

## 📚 进一步学习

- [设计系统文档](../design-system/README.md) - 了解完整设计规范
- [组件库文档](../components/README.md) - 查看所有可用组件
- [API文档](../api/README.md) - 接口调用指南
- [项目结构说明](./project-structure.md) - 详细目录结构

---

_📅 最后更新: 2025年9月27日_  
_🚀 快速开始指南: v1.1.0_
