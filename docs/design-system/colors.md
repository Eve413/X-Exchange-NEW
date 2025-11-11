# 色彩系统

X交易所的色彩系统基于现代设计理念，采用专业的紫色系作为品牌主色，配合功能性色彩，营造专业可信的视觉体验。

## 🎨 色彩理念

我们的色彩选择基于以下考虑：

- **专业性** - 金融级别的视觉表现，增强用户信任
- **现代感** - 紫色系体现创新和专业
- **功能性** - 不同颜色承载不同的信息含义
- **可访问性** - 确保足够的对比度和可读性

## 🟣 品牌色彩

### 主品牌色 (Primary)
```scss
$primary-500: #6f4bfd; // 主品牌色
```

<div style="background: #6f4bfd; width: 100px; height: 60px; border-radius: 8px; margin: 10px 0;"></div>

**使用场景:**
- 主要按钮和操作
- 品牌标识和Logo
- 重要信息突出显示
- 导航激活状态

**色阶变化:**
```scss
$primary-50: #f0ebff;   // 最浅
$primary-100: #d6c9ff;
$primary-200: #bca6ff;
$primary-300: #a283ff;
$primary-400: #8967ff;
$primary-500: #6f4bfd;  // 标准色
$primary-600: #5d3efc;
$primary-700: #4b31fb;
$primary-800: #3924fa;
$primary-900: #2717f9;  // 最深
```

### 功能色彩

#### 🟢 成功色 / 买入色 (Success)
```scss
$success-500: #19af00; // 买入绿色
```

<div style="background: #19af00; width: 100px; height: 60px; border-radius: 8px; margin: 10px 0;"></div>

**使用场景:**
- 买入按钮和操作
- 价格上涨显示
- 成功状态提示
- 正向数据展示

#### 🔴 错误色 / 卖出色 (Error)
```scss
$error-500: #d92a2a; // 卖出红色
```

<div style="background: #d92a2a; width: 100px; height: 60px; border-radius: 8px; margin: 10px 0;"></div>

**使用场景:**
- 卖出按钮和操作
- 价格下跌显示
- 错误状态提示
- 负向数据展示

#### 🟠 警告色 (Warning)
```scss
$warning-500: #ff9800; // 警告橙色
```

<div style="background: #ff9800; width: 100px; height: 60px; border-radius: 8px; margin: 10px 0;"></div>

**使用场景:**
- 警告提示
- 需要注意的信息
- 中性状态显示

## ⚫ 中性色彩

### 文本色彩
```scss
$neutral-900: #212121; // 主要文字
$neutral-600: #757575; // 次要文字
$neutral-400: #bdbdbd; // 占位符文字
```

### 背景色彩
```scss
$neutral-50: #fafafa;   // 页面背景
$neutral-100: #f5f5f5;  // 卡片背景
$neutral-800: #3f3f3f;  // 深色背景
```

## 🌈 渐变色系

### 主渐变 (Primary Gradient)
```scss
$gradient-primary: linear-gradient(135deg, #6f4bfd 0%, #d92a2a 100%);
```

**使用场景:**
- 重要按钮背景
- 品牌装饰元素
- 特殊状态标识

### 投资组合渐变 (Portfolio Gradient)
```scss
$gradient-portfolio: linear-gradient(135deg, #6f4bfd 0%, #ff6b9d 100%);
```

**使用场景:**
- 投资组合卡片背景
- 数据可视化元素
- 特色功能区域

### 成功渐变 (Success Gradient)
```scss
$gradient-success: linear-gradient(135deg, #19af00 0%, #4caf50 100%);
```

**使用场景:**
- 盈利状态显示
- 积极操作反馈
- 成功完成状态

## 🎨 色彩使用指南

### 1. 语义化使用
- **绿色系** - 只用于买入、上涨、盈利等积极含义
- **红色系** - 只用于卖出、下跌、亏损等消极含义
- **紫色系** - 品牌相关和中性操作
- **橙色系** - 警告和需要注意的信息

### 2. 对比度要求
所有文字和背景色组合必须满足WCAG 2.1 AA级标准：
- **正常文字** - 对比度不低于4.5:1
- **大号文字** - 对比度不低于3:1

### 3. 响应式适配
```scss
// 浅色模式
.light-theme {
  --text-primary: #{$neutral-900};
  --bg-primary: #{$neutral-50};
}

// 深色模式 (预留)
.dark-theme {
  --text-primary: #ffffff;
  --bg-primary: #121212;
}
```

## 📱 实际应用示例

### Vue组件中使用
```vue
<template>
  <!-- 买入按钮 - 使用成功色 -->
  <GlassButton variant="success" size="lg">
    <Icon name="arrow-up" color="inverse" /> 买入
  </GlassButton>
  
  <!-- 卖出按钮 - 使用错误色 -->
  <GlassButton variant="error" size="lg">
    <Icon name="arrow-down" color="inverse" /> 卖出
  </GlassButton>
  
  <!-- 主要操作按钮 - 使用品牌色 -->
  <GlassButton variant="primary" size="md">
    查看详情
  </GlassButton>
</template>
```

### SCSS中使用
```scss
.trading-card {
  background: $gradient-portfolio;
  border: 1px solid rgba($primary-500, 0.2);
  
  .price-up {
    color: $success-500;
  }
  
  .price-down {
    color: $error-500;
  }
  
  .neutral-info {
    color: $neutral-600;
  }
}
```

## 🛠️ 开发工具

### CSS变量定义
```css
:root {
  /* 品牌色 */
  --color-primary: #6f4bfd;
  --color-success: #19af00;
  --color-error: #d92a2a;
  --color-warning: #ff9800;
  
  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, #6f4bfd 0%, #d92a2a 100%);
  --gradient-portfolio: linear-gradient(135deg, #6f4bfd 0%, #ff6b9d 100%);
}
```

### Tailwind配置 (如果使用)
```javascript
module.exports = {
  theme: {
    colors: {
      primary: '#6f4bfd',
      success: '#19af00',
      error: '#d92a2a',
      warning: '#ff9800',
      neutral: {
        50: '#fafafa',
        600: '#757575',
        900: '#212121'
      }
    }
  }
}
```

## ✅ 色彩检查清单

设计和开发时，请确认：

- [ ] 使用了语义化的颜色选择
- [ ] 文字和背景对比度符合标准
- [ ] 买入使用绿色，卖出使用红色
- [ ] 品牌色用于重要操作和标识
- [ ] 渐变效果适度使用，不影响可读性
- [ ] 考虑了色盲用户的体验
- [ ] 深浅色模式都有考虑

---

_📅 最后更新: 2025年9月27日_  
_🎨 色彩规范: 基于设计稿v1.1.0_
