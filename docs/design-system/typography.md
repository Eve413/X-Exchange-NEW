# 字体系统

X交易所采用Plus Jakarta Sans作为主要字体，这是一款现代、专业的无衬线字体，在金融和科技领域广受欢迎。

## 🔤 字体选择理念

Plus Jakarta Sans的选择基于以下考虑：

- **现代感** - 简洁的线条，体现科技感和创新
- **专业性** - 在金融领域具有权威感和可信度
- **可读性** - 优秀的屏幕显示效果，适合数字界面
- **国际化** - 良好的多语言支持，完美支持中英文混排
- **可访问性** - 清晰的字形，有利于视觉障碍用户

## 📥 字体集成

### Google Fonts CDN
```scss
// 在 styles/index.scss 中自动导入
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
```

### 字体堆栈定义
```scss
$font-family-primary: 'Plus Jakarta Sans', 
                      -apple-system, 
                      BlinkMacSystemFont, 
                      'Segoe UI', 
                      'PingFang SC', 
                      'Hiragino Sans GB', 
                      'Microsoft YaHei', 
                      'Helvetica Neue', 
                      Helvetica, 
                      Arial, 
                      sans-serif;
```

## ⚖️ 字体粗细 (Font Weight)

### 可用字重
```scss
$font-weight-light: 300;      // 细体 - 用于装饰性文字
$font-weight-normal: 400;     // 常规 - 用于正文
$font-weight-medium: 500;     // 中等 - 用于重要信息
$font-weight-semibold: 600;   // 半粗 - 用于小标题
$font-weight-bold: 700;       // 粗体 - 用于标题
$font-weight-extrabold: 800;  // 特粗 - 用于重要标题
```

### 使用场景
- **Light (300)** - 大号装饰文字、次要信息
- **Normal (400)** - 正文内容、描述文字
- **Medium (500)** - 导航链接、按钮文字
- **Semibold (600)** - 卡片标题、表格标题
- **Bold (700)** - 页面标题、重要数字
- **Extra Bold (800)** - Logo、特殊标题

## 📏 字体尺寸 (Font Size)

### 尺寸定义
```scss
$font-size-xs: 20upx;     // 12px - 辅助信息
$font-size-sm: 24upx;     // 14px - 小文字
$font-size-base: 28upx;   // 16px - 基础文字
$font-size-lg: 32upx;     // 18px - 大文字
$font-size-xl: 36upx;     // 20px - 特大文字
$font-size-2xl: 40upx;    // 24px - 小标题
$font-size-3xl: 48upx;    // 28px - 标题
$font-size-4xl: 56upx;    // 32px - 大标题
```

### 响应式字体
```scss
// 移动端适配
@media (max-width: 768px) {
  $font-size-base: 32upx;  // 稍大的基础字号
  $font-size-lg: 36upx;
  $font-size-xl: 40upx;
}
```

## 📐 行高 (Line Height)

### 行高定义
```scss
$line-height-none: 1;        // 1.0 - 单行标题
$line-height-tight: 1.25;    // 1.25 - 紧凑标题
$line-height-snug: 1.375;    // 1.375 - 小标题
$line-height-normal: 1.5;    // 1.5 - 正文内容
$line-height-relaxed: 1.625; // 1.625 - 宽松文本
$line-height-loose: 2;       // 2.0 - 特殊用途
```

### 使用建议
- **标题类** - 使用tight或snug (1.25-1.375)
- **正文类** - 使用normal (1.5)
- **按钮文字** - 使用none或tight (1-1.25)
- **长文本** - 使用relaxed (1.625)

## 🎨 字体组合预设

### 预定义组合
```scss
// 大标题 - 粗体 + 大号 + 紧凑行高
$font-heading-bold: #{$font-weight-bold} #{$font-size-2xl}/#{$line-height-tight} #{$font-family-primary};

// 中标题 - 中等粗体 + 中大号 + 标准行高
$font-heading-medium: #{$font-weight-medium} #{$font-size-xl}/#{$line-height-normal} #{$font-family-primary};

// 正文粗体 - 粗体 + 基础号 + 标准行高
$font-body-bold: #{$font-weight-bold} #{$font-size-base}/#{$line-height-normal} #{$font-family-primary};

// 正文中等 - 中等粗体 + 基础号 + 标准行高
$font-body-medium: #{$font-weight-medium} #{$font-size-base}/#{$line-height-normal} #{$font-family-primary};

// 说明文字 - 中等粗体 + 小号 + 标准行高
$font-caption-medium: #{$font-weight-medium} #{$font-size-sm}/#{$line-height-normal} #{$font-family-primary};
```

## 📱 使用示例

### HTML/CSS
```html
<h1 class="text-heading-bold">投资组合总览</h1>
<h2 class="text-heading-medium">今日盈亏</h2>
<p class="text-body-medium">您的投资组合今日上涨了 8.98%</p>
<span class="text-caption-medium">最后更新：刚刚</span>
```

```css
.text-heading-bold {
  font: var(--font-heading-bold);
  color: var(--color-text-primary);
}

.text-heading-medium {
  font: var(--font-heading-medium);
  color: var(--color-text-primary);
}

.text-body-medium {
  font: var(--font-body-medium);
  color: var(--color-text-secondary);
}

.text-caption-medium {
  font: var(--font-caption-medium);
  color: var(--color-text-placeholder);
}
```

### Vue组件中使用
```vue
<template>
  <div class="portfolio-summary">
    <!-- 主标题 -->
    <h1 class="portfolio-title">
      我的投资组合
    </h1>
    
    <!-- 金额显示 -->
    <div class="portfolio-amount">
      $20,563.02
    </div>
    
    <!-- 变化百分比 -->
    <div class="portfolio-change positive">
      +8.98% 今日
    </div>
    
    <!-- 说明文字 -->
    <p class="portfolio-note">
      数据更新于 2分钟前
    </p>
  </div>
</template>

<style lang="scss" scoped>
.portfolio-title {
  font: $font-heading-medium;
  color: $neutral-900;
  margin-bottom: 16upx;
}

.portfolio-amount {
  font: $font-weight-bold 64upx/1.2 $font-family-primary;
  color: $neutral-900;
  margin-bottom: 8upx;
}

.portfolio-change {
  font: $font-body-medium;
  
  &.positive {
    color: $success-500;
  }
  
  &.negative {
    color: $error-500;
  }
}

.portfolio-note {
  font: $font-caption-medium;
  color: $neutral-600;
  margin-top: 12upx;
}
</style>
```

## 🌍 多语言支持

### 中英文混排优化
```scss
// 针对中文优化的行高
.text-chinese {
  line-height: 1.6;
  letter-spacing: 0.05em;
}

// 英文数字优化
.text-numeric {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
```

### 语言特定调整
```scss
// 中文环境下的调整
[lang="zh-CN"], [lang="zh-TW"] {
  .text-body-medium {
    line-height: 1.6; // 中文需要更大的行高
  }
}

// 英文环境下的调整
[lang="en-US"] {
  .text-body-medium {
    line-height: 1.5; // 英文标准行高
    letter-spacing: -0.01em; // 轻微紧缩
  }
}
```

## 🎯 交易所专用字体样式

### 数字显示
```scss
// 价格数字 - 等宽数字，便于对比
.price-display {
  font: $font-weight-bold $font-size-lg/$line-height-tight $font-family-primary;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

// 大额显示 - 特大号金额
.amount-large {
  font: $font-weight-bold 64upx/1.2 $font-family-primary;
  font-variant-numeric: tabular-nums;
}

// 小额显示 - 小号金额
.amount-small {
  font: $font-weight-medium $font-size-sm/$line-height-normal $font-family-primary;
  font-variant-numeric: tabular-nums;
}
```

### 状态文字
```scss
// 涨跌状态
.status-change {
  font: $font-weight-medium $font-size-sm/$line-height-tight $font-family-primary;
  
  &.positive {
    color: $success-500;
  }
  
  &.negative {
    color: $error-500;
  }
}
```

## ✅ 字体使用检查清单

在使用字体时，请确认：

- [ ] 已正确引入Plus Jakarta Sans字体
- [ ] 使用了预定义的字体组合而非自定义
- [ ] 标题使用了合适的字重 (600-800)
- [ ] 正文使用了标准字重 (400-500)
- [ ] 数字使用了等宽变体 (tabular-nums)
- [ ] 行高符合内容类型 (标题紧凑，正文标准)
- [ ] 考虑了中英文混排的显示效果
- [ ] 在不同设备上测试了显示效果

---

_📅 最后更新: 2025年9月27日_  
_🔤 字体规范: Plus Jakarta Sans v1.1.0_
